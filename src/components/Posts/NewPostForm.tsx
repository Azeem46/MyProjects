import { Alert, Text, Flex, Icon, AlertIcon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline, IoVideocamOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import Tabitem from "./TabItem";
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import VideoUpload from './PostForm/VideoUpload'; // Import VideoUpload component
import { Post } from '@/src/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/src/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '@/src/hooks/useSelectFile';
import useSelectMedia from '@/src/hooks/useSelectMedia'; // Import useSelectMedia hook
import Link from './PostForm/Link';

type NewPostFormProps = {
    user: User;
    communityImageURL?: string;
};

const formTabs: TabItem[] = [
    {
        title: "Post",
        icon: IoDocumentText,
    },
    {
        title: "Images & Video",
        icon: IoImageOutline,
    },
    {
        title: "Link",
        icon: BsLink45Deg,
    },
];

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageURL }) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    });

    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const { selectedMedia, setSelectedMedia, onSelectMedia } = useSelectMedia(); // Initialize useSelectMedia hook
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCreatePost = async () => {
        const { communityId } = router.query;
        const newPost: Post = {
            communityId: communityId as string,
            communityImageURL: communityImageURL || "",
            creatorId: user.uid,
            creatorDisplayName: user.email!.split("@")[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
        };

        setLoading(true);
        try {
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                });
            }

            if (selectedMedia) {
                const mediaRef = ref(storage, `posts/${postDocRef.id}/video`);
                await uploadString(mediaRef, selectedMedia, "data_url");
                const downloadURL = await getDownloadURL(mediaRef);
                await updateDoc(postDocRef, {
                    videoURL: downloadURL,
                });
            }

            router.back();
        } catch (error: any) {
            console.log("handleCreatePost error", error.message);
            setError(true);
        }
        setLoading(false);
    };

    const onTextChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {
            target: { name, value },
        } = event;
        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item) => (
                    <Tabitem
                        key={item.title}
                        item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === "Post" && (
                    <TextInputs
                        textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={onTextChange}
                        loading={loading}
                    />
                )}
                {selectedTab === "Images & Video" && (
                    <>
                        <ImageUpload
                            selectedFile={selectedFile}
                            onSelectImage={onSelectFile}
                            setSelectedTab={setSelectedTab}
                            setSelectedFile={setSelectedFile}
                        />
                        <VideoUpload // Render VideoUpload component
                            selectedVideo={selectedMedia}
                            onSelectVideo={onSelectMedia}
                            setSelectedTab={setSelectedTab}
                            setSelectedVideo={setSelectedMedia}
                        />
                    </>
                )}
                 {selectedTab === "Link" && (
                    <Link
                    textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={onTextChange}
                        loading={loading}
                    />
                )}
            </Flex>
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <Text>Error creating post</Text>
                </Alert>
            )}
        </Flex>
    );
};

export default NewPostForm;