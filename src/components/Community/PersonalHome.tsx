import React, { useCallback, useState } from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import useDirectory from "@/src/hooks/useDirectory";
import CreateCommunityModal from "../Modal/CreateCommunnity/CreateCommunityModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { BsRobot } from "react-icons/bs";
// import { handleCreateCommunity } from "../Modal/CreateCommunnity/CreateCommunityModal";
// handleCreateCommunity();

const PersonalHome: React.FC = () => {
  const [user] = useAuthState(auth);
  
  const { toggleMenuOpen } = useDirectory();
  const[open, setOpen] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
   //const { handleCreateCommunity } = CreateCommunityModal();
   const handleCreateCommunity = () => {
    if(!user) {
            //open modal
            setAuthModalState({ open: true, view: "login"});
            return;
        }
    setOpen(true); // Open the CreateCommunityModal
  };
  return (<><CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={BsRobot} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal IdeaShare frontpage, built for you.
          </Text>
           
            <Button height="30px" onClick={toggleMenuOpen}>Create Post</Button>
          <Button variant="outline" height="30px" onClick={handleCreateCommunity}>
            Create Community
          </Button>
        </Stack>
      </Flex>
       
    </Flex></>
  );
};
export default PersonalHome;