import { Button, Flex, Input, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

// Dynamic import for Quill.js to ensure it's only loaded on the client-side
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

type TextInputsProps = {
    textInputs: {
        title: string;
        body: string;
    };
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => void;
    handleCreatePost: () => void;
    loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
    textInputs,
    onChange,
    handleCreatePost,
    loading,
}) => {
    const [body, setBody] = useState(textInputs.body);
    const defaultModules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['link',],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
};

    // Ensure Quill.js is loaded on the client-side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize Quill.js here
        }
    }, []);

    const handleBodyChange = (value: string) => {
        setBody(value);
        onChange({ target: { name: 'body', value } } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };

    return (
        <Stack spacing={3} width="100%" >
            <Input
                name="title"
                value={textInputs.title}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Title"
                _placeholder={{ color: 'gray.500' }}
                _focus={{
                    outline: 'none',
                    bg: '1px solid',
                    borderColor: 'black',
                }}
            />
            
            {/* Render ReactQuill component only on the client-side */}
            {typeof window !== 'undefined' && (
                <ReactQuill
                    value={body}
                    onChange={handleBodyChange}
                    modules={defaultModules} // Pass default modules here
                    theme="snow"
                    placeholder="Text (optional)"
                    style={{
                        fontSize: '10pt',
                        height: '100px'
                    }}
                />
            )}

            <div>
                <Flex justify="flex-end">
                    <Button
                        height="25px"
                        padding="10px 30px"
                        disabled={!textInputs.title}
                        isLoading={loading}
                        onClick={handleCreatePost}
                    >
                        Post
                    </Button>
                </Flex>
            </div>
        </Stack>
    );
};

export default TextInputs;
