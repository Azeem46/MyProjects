import React, { useEffect } from 'react';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/directoryMenuAtom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { communityState } from '../atoms/communitiesAtom';
import { FaReddit } from 'react-icons/fa';
import { authModalState } from '../atoms/authModalAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';


const useDirectory = () => {
    const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const communityStateValue = useRecoilValue(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);

    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: menuItem
        }));
        router.push(menuItem.link);
        if (directoryState.isOpen) {
            toggleMenuOpen();
        }
    }

    const toggleMenuOpen = () => {
        if(!user) {
            //open modal
            setAuthModalState({ open: true, view: "login"});
            return;
        }
        setDirectoryState((prev) => ({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    useEffect(() => {

        const { currentCommunity } = communityStateValue;

        if(currentCommunity) {
            setDirectoryState((prev) => ({
                ...prev,
                selectedMenuItem: { 
                    displayText: `i/${currentCommunity.id}`, 
                    link: `/i/${currentCommunity.id}`,
                    imageURL: currentCommunity.imageURL,
                    icon: FaReddit,
                    iconColor: "blue.500"
                }
            }))
        }

    }, [communityStateValue.currentCommunity])

    return { directoryState, toggleMenuOpen, onSelectMenuItem };
}
export default useDirectory;