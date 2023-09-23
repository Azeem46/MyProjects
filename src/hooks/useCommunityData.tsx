import React, { useEffect, useState } from 'react';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/clientApp';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';


const useCommunityData = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
        //is the user signed in?
        //if not => open auth model
        if(!user) {
            //open modal
            setAuthModalState({ open: true, view: "login"});
            return;
        }

        if(isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    };

    const getMySnippets = async () => {
        setLoading(true);
        try {
            // get user snippets
            const snippetDocs = await getDocs(
                collection(firestore, `users/${user?.uid}/communitySnippets`)
                );

            const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                snippetsFetched: true,
            }))
            console.log("Here are snippets", snippets);
        } catch (error: any) {
            console.log("getMySnippets error", error);
            setError(error.message);
        }
        setLoading(false);
    };

    const joinCommunity = async (communityData: Community) => {
        
        //batch write
        //updating the number of memebers(1)

        try {
            const batch = writeBatch(firestore);

            // create a new community snippet
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId,
            };

            batch.set(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    communityData.id
                    ),
                     newSnippet
                     );

            batch.update(doc(firestore, "communities", communityData.id),{
                numberofMembers: increment(1),
            });
            
           await batch.commit();

           //update recoil state= communityState.mySnippets
           setCommunityStateValue((prev) => ({
            ...prev,
            mySnippets: [...prev.mySnippets, newSnippet],
           }));
        } catch (error: any) {
            console.log("joinCommunity error", error);
            setError(error.message);
        }
        setLoading(false);
    };

    const leaveCommunity = async (communityId: string) => {

        //batch write
        try {
            const batch = writeBatch(firestore);

            // deleting the community snippet from user
            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`,communityId)
            );
            //updating the number of memebers (-1)
            batch.update(doc(firestore, "communities", communityId),{
                numberofMembers: increment(-1),
            });

            await batch.commit();

            // update recoil state= communityState.mySnippets
            setCommunityStateValue((prev) =>({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item) => item.communityId !== communityId
                ),
            }));
        } catch (error: any) {
            console.log("leaveCommunity error", error.message);
            setError(error.message);
        } 
        setLoading(false);
    };

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(firestore, "communities", communityId);
            const commmunityDoc = await getDoc(communityDocRef);
            
            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    id: commmunityDoc.id,
                    ...commmunityDoc.data(),
                } as Community,
            }));

        } catch (error) {
            console.log("getCommunityData", error);
        }
    }

    useEffect(() => {
        if(!user) {
            setCommunityStateValue((prev)=> ({
                ...prev,
                mySnippets: [],
                snippetsFetched: false,
        }));
        return;
        }
        getMySnippets();
    }, [user]);

    useEffect(() => {
        const { communityId } = router.query;

        if (communityId && !communityStateValue.currentCommunity){
            getCommunityData(communityId as string);
        } 
    }, [router.query, communityStateValue.currentCommunity]);

    return {
        // data and function
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    }
}
export default useCommunityData;