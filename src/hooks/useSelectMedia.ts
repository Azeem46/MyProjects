import React, { useState } from 'react';

const useSelectMedia = () => {
    const [selectedMedia, setSelectedMedia] = useState<string>();

    const onSelectMedia = (file: File) => {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedMedia(readerEvent.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    return {
        selectedMedia,
        setSelectedMedia,
        onSelectMedia
    };
};

export default useSelectMedia;
