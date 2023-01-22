import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Text,
    useToast,
    SimpleGrid,
    Heading,
    Center,
    HStack,
    VStack,
    Divider
} from '@chakra-ui/react';
import { useSelector } from "react-redux";
import ArtistCard from "./ArtistCard";
export default function ArtistGranting() {
    const { signer } = useSelector(state => state.hub);
    const selectedChain = useSelector(state => state.chain.selectedChain);

    const [list, setList] = useState([]);
    const toast = useToast();
    
    const loadList = useCallback(async () => {
        try {
            let waitingList = await fetch(`/api/artist/${selectedChain}`);
            let waitingRes = await waitingList.json();
            setList(waitingRes.result);
        } catch (e) {
            toast({
                status: 'error',
                title: `Error: ${e.message}`,
                duration: 3000
            })
        }
    }, [])

    useEffect(() => {
        loadList();
    }, [selectedChain])
    
    const handleApprove = useCallback( async(address) => {
        let artistRole = await signer.ARTIST_ROLE();
        try {
            let approveRequest = await signer.grantRole(
                artistRole,
                address
            );
            await approveRequest.wait();
            await fetch(`/api/artist/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({chain: selectedChain, address: address})
            });
            loadList();
        } catch (e) {
            toast({
                status: 'error',
                title: `Error: ${e.message}`,
                duration: 3000
            })
        }
    }, [signer, selectedChain])

    const handleRemove = useCallback(async (address) => {
        let artistRole = await signer.ARTIST_ROLE();
        try {
            let approveRequest = await signer.revokeRole(
                artistRole,
                address
            );
            await approveRequest.wait();
            await fetch(`/api/artist/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chain: selectedChain, address: address })
            });
            loadList();
        } catch (e) {
            toast({
                status: 'error',
                title: `Error: ${e.message}`,
                duration: 3000
            })
        }
    }, [signer, selectedChain])

    const handleReject = useCallback(async (address) => {
        try {
            await fetch(`/api/artist/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chain: selectedChain, address: address })
            });
            loadList();
        } catch (e) {
            toast({
                status: 'error',
                title: `Error: ${e.message}`,
                duration: 3000
            })
        }
    }, [selectedChain])

    return (
        <VStack gap={2}>
            <Heading>List waiting</Heading>
            <SimpleGrid columns={3}>
                {list.length > 0 && list.filter(fItem => !fItem.approved).map(item => 
                    <ArtistCard key={item.address} {...item.user} approved={false}
                        handleApprove={() => handleApprove(item.address)}
                        handleRemove={() => handleReject(item.address)}
                    />
                )}
            </SimpleGrid>
            <Divider />
            <Heading>List Approved</Heading>
            <SimpleGrid columns={3}>
                {list.length > 0 && list.filter(fItem => fItem.approved).map(item =>
                    <ArtistCard key={item.address} {...item.user} approved={true}
                        handleApprove={() => handleApprove(item.address)}
                        handleRemove={() => handleRemove(item.address)}
                    />
                )}
            </SimpleGrid>
        </VStack>

    );
}