import { auth, firestore } from '@/src/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/src/firebase/errors';
import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithTwitter } from 'react-firebase-hooks/auth';
const OAuthButtons:React.FC = () => {
  const [SignInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth); 
  const[SignInWithTwitter, tuser, tloading,terror] = useSignInWithTwitter(auth);
   const createUserDocument = async (user: User) =>{
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
   }
   useEffect(() => {
    if(userCred) {
        createUserDocument(userCred.user);
    }
   },[userCred]);
    return (
        <Flex direction= "column" width="100%" mb={4}>
            <Button variant="oauth" mb={2}
             _hover={{
                bg:'white',
                border: '1px solid',
                borderColor: 'blue.500'
    
            }}
            _focus={{
                outline: 'none',
                bg:'white',
                border: '1px solid',
                borderColor: 'blue.500'
            }}
            isLoading={loading}
            onClick={() => SignInWithGoogle()}
            >
                <Image src="/images/googlelogo.png" height="20px" mr={4} />
                Continue with Google
            </Button>
            <Button variant="oauth" mb={2}
            _hover={{
                bg:'white',
                border: '1px solid',
                borderColor: 'blue.500'
    
            }}
            _focus={{
                outline: 'none',
                bg:'white',
                border: '1px solid',
                borderColor: 'blue.500'
            }}
            isLoading={tloading}
            onClick={() => SignInWithTwitter()}
            >
                <Image src="/images/twitter.png" height="30px" mr={4} />
                Continue with Twitter
            </Button>
            <Text textAlign="center" color="red" fontSize="10pt">
            {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
                </Text>
        </Flex>
    );
};
export default OAuthButtons;