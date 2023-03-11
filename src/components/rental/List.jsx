import React, { useEffect, useState, useMemo } from 'react';
import {
    SimpleGrid,
    SkeletonCircle,
    SkeletonText,
    Box
} from "@chakra-ui/react";
import RentalCard from 'src/components/rental/Card';
import { useDispatch, useSelector } from 'react-redux';
import { config } from 'src/state/chain/config';
import loadContract from 'src/state/rental/thunks/loadContract';

export default function RentalList({ address, columns }) {
    const dispatch = useDispatch();
    const { account, selectedChain, tokens: { obj: tokenObj } } = useSelector(state => state.chain);
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { contract, loaded } = useSelector(state => state.rental);
    const canEdit = useMemo(() => address === account, [address, account])

    const loadRental = async (chain) => {
        console.log("gohhh")
        setIsLoading(true);
        let listObj = {};
        let nftListReq = await fetch(`/api/nft/get-by-owner?chain=${chain}&address=${config[chain].rentalAddress}`, { headers: { "content-type": "application/json" } });
        let nftListRes = await nftListReq.json();
        console.log(nftListRes)
        nftListRes.data.forEach(item => {
            listObj[item.ipnft.toLowerCase()] = item;
        });
        let rentalItems = await contract.getCovenants();
        console.log(rentalItems)
        let mapList = [];
        if (address) {
            mapList = rentalItems.filter(fItem => (fItem.config.lender.toLowerCase() == address && fItem.status != 0))
                .map(item => {
                    let keyNft = (item.config.nftContract + "@" + item.config.tokenId.toString()).toLowerCase();
                    if (listObj.hasOwnProperty(keyNft)) {
                        return ({ ...item, ...listObj[keyNft], accepted: true })
                    } else {
                        return ({ ...item, accepted: false })
                    }
                }).filter(mItem => mItem.accepted);
        } else {
            mapList = rentalItems.filter(fItem => fItem.status != 0).map(item => {
                let keyNft = (item.config.nftContract + "@" + item.config.tokenId.toString()).toLowerCase();
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
        if (selectedChain) {
            if (loaded) {
                loadRental(selectedChain);
            } else {
                dispatch(loadContract());
            }
        }
    }, [loaded, selectedChain]);

    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;
    return (
        <SimpleGrid h={'min'} columns={columns ? columns : 3} gap={5} w={'full'}>
            {list.map(item =>
                <RentalCard canEdit={canEdit} {...item} tokenInfo={tokenObj[item.config.ftContract.toLowerCase()]} />
            )}
        </SimpleGrid>
    );
}