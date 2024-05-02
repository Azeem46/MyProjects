import { Community } from '@/src/atoms/communitiesAtom';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from "react-icons/fa";
import useCommunityData from '@/src/hooks/useCommunityData';
import { BsRobot } from 'react-icons/bs';
type HeaderProps = {
    communityData: Community;
};

const Header:React.FC<HeaderProps> = ({ communityData }) => {
    
    const { communityStateValue, onJoinOrLeaveCommunity, loading} = useCommunityData();
    const isJoined = !!communityStateValue.mySnippets.find(
        (item) => item.communityId == communityData.id
    );
    return (
        <Flex direction="column" width="100%" height="420px">
        <Box height="300%" bg="blue.400">
    {communityStateValue.currentCommunity?.backgroundImageURL ? (
        <Image
            src={communityStateValue.currentCommunity.backgroundImageURL}
            alt="image"
            position="relative"
            height="350"
            width="1600px"
            objectFit="cover" // Preserve aspect ratio and cover the entire box
        />
    ) : (
        <Icon as={BsRobot} />
    )}
</Box>
            <Flex justify="center" bg="white" flexGrow={1}>
                <Flex width="95%" maxWidth="860px" >
                    {communityStateValue.currentCommunity?.imageURL ? (
                        <Image 
                        borderRadius="full"
                        boxSize="66px"
                        src={communityStateValue.currentCommunity.imageURL}
                        alt="image"
                        position="relative"
                        top={-3}
                        color="blue.500"
                        border="4px solid white"
                        />
                    ): (
                        <Icon 
                    as={BsRobot}
                     fontSize={64}
                      position="relative"
                       top={-1}
                       color="blue.500"
                       border="4px solid white"
                       borderRadius="full"
                       />
                    )}
                    <Flex padding="10px 16px">
                        <Flex direction="column" mr={6}>
                        <Text fontWeight={800} fontSize="16pt">
                            {communityData.id}</Text>
                        <Text fontWeight={600} fontSize="10pt" color="gray.400">
                            i/{communityData.id}</Text>
                        </Flex>
                        <Button 
                        variant={isJoined ? "outline" : "solid"
                        }
                         height="30px"
                          pr={6}
                           pl={6}
                           isLoading={loading}
                            onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
                            >
                                {isJoined ? "Joined" : "Join"}
                                </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
export default Header;