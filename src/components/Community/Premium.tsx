import React from "react";
import { Flex, Icon, Text, Stack, Button } from "@chakra-ui/react";
import { GiCheckedShield } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";

const Premium: React.FC = () => {
  const handleTryNowClick = () => {
    // Redirect to the specified URL
    window.location.href = "https://thread-app-nu.vercel.app/";
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex mb={2}>
        <Icon as={BsRobot} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600}>IdeaShare 2.O</Text>
          <Text>The best Ideashare 2.O experience</Text>
        </Stack>
      </Flex>
      <Button height="30px" bg="brand.100" onClick={handleTryNowClick}>
        Try Now
      </Button>
    </Flex>
  );
};

export default Premium;
