import { Flex, Stack, Button } from '@chakra-ui/react';
import React, { useRef } from 'react';

type VideoUploadProps = {
    selectedVideo?: string;
    onSelectVideo: (file: File) => void;
    setSelectedTab: (value: string) => void;
    setSelectedVideo: (value: string) => void;
};

const VideoUpload: React.FC<VideoUploadProps> = ({ selectedVideo, onSelectVideo, setSelectedTab, setSelectedVideo }) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);

    return (
        <Flex direction="column" justify="center" align="center" width="100%">
            {selectedVideo ? (
                <>
                    <video src={selectedVideo} controls height="400px" width="400px" />
                    <Stack direction="row" mt={4}>
                        <Button height="28px" onClick={() => setSelectedTab("Post")}>
                            Back to Post
                        </Button>
                        <Button
                            variant="outline"
                            height="28px"
                            onClick={() => setSelectedVideo("")}
                        >
                            Remove
                        </Button>
                    </Stack>
                </>
            ) : (
                <Flex
                    justify="center"
                    align="center"
                    p={20}
                    border="1px dashed"
                    borderColor="gray.200"
                    width="100%"
                    borderRadius={4}
                >
                    <Button
                        variant="outline"
                        height="20px"
                        onClick={() => selectedFileRef.current?.click()}
                    >
                        Video
                    </Button>
                    <input
                        ref={selectedFileRef}
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={(event) => {
                            if (event.target.files?.[0]) {
                                onSelectVideo(event.target.files[0]);
                            }
                        }}
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default VideoUpload;
