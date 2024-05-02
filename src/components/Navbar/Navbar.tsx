import React from 'react';
import { Flex, Image } from "@chakra-ui/react";
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';
import Directory from './Directory/Directory';
import useDirectory from '@/src/hooks/useDirectory';
import { defaultMenuItem } from '@/src/atoms/directoryMenuAtom';
const Navbar:React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();  
  return (
         <Flex bg="white" 
         height="44px"
          padding="6px 12px"
           justifyContent={{md: "space-between"}}
           >
           <Flex align="center"
           width={{ base: "40px", md: "auto" }}
           mr={{ base: 0, md: 2 }}
           cursor="pointer"
           onClick={() => onSelectMenuItem(defaultMenuItem) }
           >
            <Image src="/images/robot.png" height="30px" />
            <Image 
             display={{base: 'none', md: "unset"}}
            src="/images/11.png" 
            height="16px"  
            />
           </Flex>
           {user && <Directory />}
           <SearchInput user={user}/>
           <RightContent user={user} /> 
         </Flex> 
    );
};
export default Navbar;