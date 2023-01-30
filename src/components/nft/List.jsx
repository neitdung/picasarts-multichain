import React, { useContext, useEffect, useState } from 'react';
import {
    SimpleGrid,
    SkeletonCircle,
    SkeletonText,
    Box
} from "@chakra-ui/react";
import { loadNfts } from 'src/state/actions';
import { appStore } from 'src/state/app';
import NFTCard from './Card';
import { addressNone } from 'src/config/contractAddress';

export default function NFTList({ address, columns }) {
    const { state, dispatch } = useContext(appStore);
    const { app: {mounted, tronRead}, nfts, wallet: { address}, nftContract:{nftAddress = address}, tokenObj } = state;
    const [isLoading, setIsLoading] = useState(true);
    const [list, setList] = useState([]);
    const canEdit = address == base58;
    useEffect(() => {
        if (!nfts.mounted) {
            if (mounted) {dispatch(loadNfts());}
        } else {
            setIsLoading(false)
            let list = nfts.list;
            let filterList = address ? list.filter(item => item.owner == tronRead.address.toHex(address)) : list;
            setList(filterList);
        }
    }, [mounted, nfts.mounted, nftAddress]);

    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;

    return (
        <SimpleGrid h={'min'} columns={columns ? columns: 4} gap={5} w={'full'}>
            {list.map(item =>
                <NFTCard {...item} canEdit={canEdit} tokenInfo={tokenObj[addressNone]} />
            )}
        </SimpleGrid>
    );
}