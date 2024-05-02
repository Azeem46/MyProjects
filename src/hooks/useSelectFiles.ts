import React, { useState } from 'react';


const useSelectFiles = () => {
     const [selectedFiles, setSelectedFiles] = useState<string>();

     const onSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("THIS IS HAPPENING", event);
    const reader = new FileReader();

    if(event.target.files?.[0]){
        reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
        if(readerEvent.target?.result){
            setSelectedFiles(readerEvent.target.result as string);
        }
    };
   };
    
    return {
        selectedFiles, 
        setSelectedFiles, 
        onSelectFiles
    }
}
export default useSelectFiles;