import React, { useEffect, useState } from 'react';
import {
    SimpleGrid,
    SkeletonCircle,
    SkeletonText,
    Box
} from "@chakra-ui/react";
import MarketCard from 'src/components/market/Card';
import { useDispatch, useSelector } from 'react-redux';
import { marketAddress } from 'src/state/chain/config';
import loadContract from 'src/state/market/thunks/loadContract';

export default function MarketList({ address, columns }) {
    const dispatch = useDispatch();
    const {selectedChain, tokens: { obj: tokenObj}} = useSelector(state => state.chain);
    const {contract, loaded} = useSelector(state => state.market);

    const [isLoading, setIsLoading] = useState(true);
    const [list, setList] = useState([]);

    const loadMarket = async () => {
        setIsLoading(true);
        let listObj = {};
        let nftListReq = await fetch(`/api/nft/get-by-owner?chain=${selectedChain}&address=${marketAddress}`, { headers: { "content-type": "application/json" } });
        let nftListRes = await nftListReq.json();
        nftListRes.data.forEach(item => {
            listObj[item.ipnft.toLowerCase()] = item;
        });
        let marketItems = await contract.getListedNfts();
        let mapList = [];
        if (address) {
            mapList = marketItems.filter(fItem => (fItem.seller == address))
                .map(item => {
                    let keyNft = (item.nftContract + "@" + item.tokenId.toString()).toLowerCase();
                    if (listObj.hasOwnProperty(keyNft)) {
                        return ({ ...item, ...listObj[keyNft], accepted: true })
                    } else {
                        return ({...item, accepted: false})
                    }
                }).filter(mItem => mItem.accepted);
        } else {
            mapList = marketItems.map(item => {
                let keyNft = (item.nftContract + "@" + item.tokenId.toString()).toLowerCase();
                if (listObj.hasOwnProperty(keyNft)) {
                    return ({ ...item, ...listObj[keyNft], accepted: true })
                } else {
                    return ({ ...item, accepted: false })
                }
            }).filter(mItem => mItem.accepted);
        }
        setList(mapList);
        setIsLoading(false);
    }

    useEffect(() => {
        if (loaded) {
            loadMarket();
        } else {
            dispatch(loadContract());
        }
    }, [loaded]);

    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;
    return (
        <SimpleGrid h={'min'} columns={columns ? columns : 4} gap={5} w={'full'}>
            {list.map(item =>
                <MarketCard {...item} tokenInfo={tokenObj[item.ftContract.toLowerCase()]} />
            )}
        </SimpleGrid>
    );
}