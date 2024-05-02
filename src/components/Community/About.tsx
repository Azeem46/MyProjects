import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { Box, Button, Divider, Flex, Icon, Stack, Text, Image, Spinner } from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine} from "react-icons/ri";
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '@/src/firebase/clientApp';
import useSelectFile from '@/src/hooks/useSelectFile';
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import useSelectFiles from '@/src/hooks/useSelectFiles';
import { BsRobot } from 'react-icons/bs';


type AboutProps = {
    communityData: Community;
};

const About:React.FC<AboutProps> = ({ communityData }) => {
        const [user] = useAuthState(auth);
        const selectedFileRef = useRef<HTMLInputElement>(null);
        const selectedFileRefs = useRef<HTMLInputElement>(null);
        const{ selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
        const{ selectedFiles, 
        setSelectedFiles, 
        onSelectFiles} = useSelectFiles();
        const [uploadingImage, setUploadingImage] = useState(false);
        const [uploadingImages, setUploadingImages] = useState(false);
        const setCommunityStateValue = useSetRecoilState(communityState);
        const [showSaveChanges, setShowSaveChanges] = useState(true);
        const [saveChanges, setSaveChanges] = useState(true);
       
         useEffect(() => {
        // Show "Save Changes" text only when there are selected files
        setShowSaveChanges(!!selectedFiles);
    }, [selectedFiles]);

     useEffect(() => {
        // Show "Save Changes" text only when there are selected files
        setSaveChanges(!!selectedFile);
    }, [selectedFile]);


        const onUpdateImage = async () => {
            if (!selectedFile) return;
            setUploadingImage(true);
            try {
                const imageRef = ref(storage, `communities/${communityData.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(firestore, "communities", communityData.id), {
                    imageURL: downloadURL,
                });
                setCommunityStateValue((prev) => ({
                    ...prev,
                    currentCommunity: {
                        ...prev.currentCommunity,
                        imageURL: downloadURL
                    } as Community,
                }))
                setSaveChanges(false);
            } catch (error) {
                console.log("onUpdateImage error", error);
            }
            setUploadingImage(false);
        };


       const onUpdateImages = async () => {
        if (!selectedFiles) return;
        setUploadingImages(true);
        try {
            const imageRef = ref(storage, `communities/${communityData.id}/background_image`);
            await uploadString(imageRef, selectedFiles, "data_url");
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(firestore, "communities", communityData.id), {
                backgroundImageURL: downloadURL,
            });
            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    ...prev.currentCommunity,
                    backgroundImageURL: downloadURL
                } as Community,
            }));
            setShowSaveChanges(false); // Hide "Save Changes" text after successful update
        } catch (error) {
            console.log("onUpdateImage error", error);
        }
        setUploadingImages(false);
    };

    return (
        <Box position="sticky" top="14px">
            <Flex
            justify="space-between"
            align="center"
            bg="blue.400"
            color="white"
            p={3}
            borderRadius="4px 4px 0px 0px"
            >
                <Text fontSize="10pt" fontWeight={700}>About Community</Text>
            <Icon as={HiOutlineDotsHorizontal} />
            </Flex>
            <Flex
            direction="column"
            p={3}
            bg="white"
            borderRadius="4px 4px 0px 0px"
            >
                <Stack>
                    <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
                        <Flex direction="column" flexGrow={1}>
                            <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
                            <Text>Members</Text>
                        </Flex>
                        <Flex direction="column" flexGrow={1}>
                            <Text>1</Text>
                            <Text>Online</Text>
                        </Flex>
                    </Flex>
                    <Divider />
                    <Flex align="center" width="100%" p={1} fontWeight={500} fontSize="10pt">
                        <Icon as={RiCakeLine} fontSize={18} mr={2} />
                       {communityData.createdAt && ( 
                       <Text>
                        Created{" "}
                        {moment(
                            new Date(communityData.createdAt.seconds * 1000)
                            ).format("MMM DD, YYYY")}
                            </Text>
                            )}
                    </Flex>
                    <Link href={`/i/${communityData.id}/submit`}>
                        <Button mt={3} height="30px">
                                Create Post
                        </Button>
                    </Link>
                    {user?.uid === communityData.creatorId && (
                        <>
                        <Divider />
                        <Stack spacing={1} fontSize="10pt">
                            <Text fontWeight={600}>Admin</Text>
                            <Flex align="center" justify="space-between">
                                <Text 
                                color="blue.500"
                                cursor="pointer"
                                _hover={{ textDecoration: "underline" }}
                                onClick={() => selectedFileRef.current?.click()}
                                >
                                    Change Image
                                    </Text>
                                    {communityData.imageURL || selectedFile ? (
                                        <Image 
                                        src={selectedFile || communityData.imageURL}
                                         borderRadius ="full"
                                         boxSize="40px"
                                         alt="Community Image"
                                         />
                                    ) : (
                                        <Icon
                                        as={BsRobot}
                                        fontSize={40}
                                        color="brand.100"
                                        mr={2}
                                        />
                                    )}
                            </Flex>
                            {selectedFile && 
                                (uploadingImage ? (
                                     <Spinner /> 
                                    ) : (
                                         <Text 
                                         cursor="pointer" onClick={onUpdateImage}
                                         // Show "Save Changes" text only when state is true
                                            display={saveChanges ? "block" : "none"} 
                                         >Save Changes</Text>
                                         ))}
                                         <input 
                                         id="file-upload"
                                         type="file"
                                         accept="image/x-png,image/gif,image/jpeg"
                                         hidden
                                         ref={selectedFileRef}
                                         onChange={onSelectFile}
                                         />
                        </Stack>
                        </>
                    )}
                      {user?.uid === communityData.creatorId && (
                <>
                    <Divider />
                    <Stack spacing={1} fontSize="10pt">
                        <Flex align="center" justify="space-between">
                            <Text 
                                color="blue.500"
                                cursor="pointer"
                                _hover={{ textDecoration: "underline" }}
                                onClick={() => selectedFileRefs.current?.click()}
                            >
                                Change Background Image
                            </Text>
                            {communityData.backgroundImageURL || selectedFiles ? (
                                <Image 
                                    src={selectedFiles || communityData.backgroundImageURL}
                                    borderRadius ="full"
                                    boxSize="40px"
                                    alt="Community Image"
                                />
                            ) : (
                                <Icon
                                    as={BsRobot}
                                    fontSize={40}
                                    color="brand.100"
                                    mr={2}
                                />
                            )}
                        </Flex>
                        {selectedFiles && 
                            (uploadingImages ? (
                                <Spinner /> 
                            ) : (
                                <Text 
                                    cursor="pointer" 
                                    onClick={onUpdateImages} 
                                    // Show "Save Changes" text only when showSaveChanges state is true
                                    display={showSaveChanges ? "block" : "none"} 
                                >
                                    Save Changes
                                </Text>
                            ))
                        }
                        <input 
                            id="file-upload"
                            type="file"
                            accept="image/x-png,image/gif,image/jpeg"
                            hidden
                            ref={selectedFileRefs}
                            onChange={onSelectFiles}
                        />
                    </Stack>
                </>
            )}
                </Stack>
            </Flex>
        </Box>
    )
}
export default About;