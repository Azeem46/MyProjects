import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunnity/CreateCommunityModal';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import { GrAdd} from 'react-icons/gr';
import { communityState } from '@/src/atoms/communitiesAtom';
import { useRecoilValue } from 'recoil';
import { FaReddit } from 'react-icons/fa';
import MenuListItem from './MenuListItem';
import { BsRobot } from 'react-icons/bs';
type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const[open, setOpen] = useState(false);
    const mySnippets = useRecoilValue(communityState).mySnippets;
    return (
        <>
        <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
         <Box my={3} mb={4}>
            <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                MODERATING
                </Text>
        {mySnippets.filter(snippet => snippet.isModerator).map((snippet) => (
            <MenuListItem 
            key={snippet.communityId} 
            icon={BsRobot} 
            displayText={`i/${snippet.communityId}`}
            link={`/i/${snippet.communityId}`}
            iconColor="brand.100"
             imageURL={snippet.imageURL}
            />
        ))}
        </Box>
        <Box my={3} mb={4}>
            <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">MY COMMUNITIES</Text>
        <MenuItem 
        width="100%"
         fontSize="10pt"
          _hover={{ bg: "gray.100"}}
           onClick={() => setOpen(true)}
           >
        <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd}/>
            Create Community
        </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
            <MenuListItem 
            key={snippet.communityId} 
            icon={BsRobot} 
            displayText={`i/${snippet.communityId}`}
            link={`/i/${snippet.communityId}`}
            iconColor="blue.500"
             imageURL={snippet.imageURL}
            />
        ))}
        </Box>
        </>
    );
};
export default Communities;