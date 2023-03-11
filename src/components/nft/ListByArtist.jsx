import React, { useState, useEffect } from 'react';
import {
    SkeletonCircle,
    SkeletonText,
    Box,

    SimpleGrid
} from "@chakra-ui/react";

import NFTCard from 'src/components/nft/Card';
import { noneAddress } from 'src/state/chain/config';
import { useSelector } from 'react-redux';

export default function NftListByArtist({ address }) {
    const { selectedChain, tokens: { obj: tokenObj } } = useSelector(state => state.chain);

    const [list, setList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const loadNfts = async () => {
        setIsLoading(true);
        let nftReq = await fetch(`/api/nft/get-by-creator?chain=${selectedChain}&address=${address}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let nftRes = await nftReq.json();
        if (!nftRes.error) {
            setList(nftRes.data)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loadNfts()
    }, []);

    if (isLoading) return <Box padding='6' boxShadow='lg' bg='white'>
        <SkeletonCircle size='30' />
        <SkeletonText mt='4' noOfLines={20} spacing='4' />
    </Box>;

    return (
        <Box>
            <SimpleGrid h={'min'} columns={4} gap={5} w={'full'}>
                {list.map(item =>
                    <NFTCard {...item} canEdit={false} tokenInfo={tokenObj[noneAddress]} />
                )}
            </SimpleGrid>
        </Box>
    );
}