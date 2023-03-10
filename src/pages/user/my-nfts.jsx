import React, { useEffect, useState } from 'react';
import {
    SimpleGrid,
    SkeletonCircle,
    SkeletonText,
    Box,
} from "@chakra-ui/react";
import NFTCard from 'src/components/nft/Card';
import { useSelector } from 'react-redux';
import { noneAddress } from 'src/state/chain/config';

export default function MyNfts({ columns }) {
    const { selectedChain, tokens: { obj: tokenObj }, account } = useSelector(state => state.chain);
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const handleLoadNft = async () => {
        setIsLoading(true);
        let getReq = await fetch(`/api/nft/get-by-owner?chain=${selectedChain}&address=${account}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let getResJson = await getReq.json();
        if (!getResJson.error) {
            setList(getResJson.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (account) {
            handleLoadNft()
        }
    }, [account])
    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;

    return (
        <SimpleGrid h={'min'} columns={columns ? columns : 4} gap={5} w={'full'} my={2}>
            {list.map(item =>
                <NFTCard {...item} canEdit={true} tokenInfo={tokenObj[noneAddress]} />
            )}
        </SimpleGrid>
    );
}