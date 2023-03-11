import React, { useEffect, useState, useMemo } from 'react';
import {
    SimpleGrid,
    SkeletonCircle,
    SkeletonText,
    Box
} from "@chakra-ui/react";
import LoanCard from 'src/components/loan/Card';
import { useDispatch, useSelector } from 'react-redux';
import { config } from 'src/state/chain/config';
import loadContract from 'src/state/loan/thunks/loadContract';

export default function LoanListLending({ address, columns }) {
    const dispatch = useDispatch();
    const { selectedChain, tokens: { obj: tokenObj } } = useSelector(state => state.chain);
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { contract, loaded } = useSelector(state => state.loan);
    const { loanAddress } = useMemo(() => config[selectedChain], [selectedChain]);

    const loadLoan = async () => {
        setIsLoading(true);
        let listObj = {};
        let nftListReq = await fetch(`/api/nft/get-by-owner?chain=${selectedChain}&address=${loanAddress}`, { headers: { "content-type": "application/json" } });
        let nftListRes = await nftListReq.json();
        nftListRes.data.forEach(item => {
            listObj[item.ipnft.toLowerCase()] = item;
        });
        let loanItems = await contract.getCovenants();
        let mapList = [];
        if (address) {
            mapList = loanItems.filter(fItem => (fItem.lender.toLowerCase() == address && fItem.status != 2))
                .map(item => {
                    let keyNft = (item.nftContract + "@" + item.tokenId.toString()).toLowerCase();
                    if (listObj.hasOwnProperty(keyNft)) {
                        return ({ ...item, ...listObj[keyNft], accepted: true })
                    } else {
                        return ({ ...item, accepted: false })
                    }
                }).filter(mItem => mItem.accepted);
        } else {
            mapList = loanItems.filter(fItem => fItem.status != 2).map(item => {
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
            loadLoan();
        } else {
            dispatch(loadContract());
        }
    }, [loaded]);

    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;
    return (
        <SimpleGrid h={'min'} columns={columns ? columns : 3} gap={5} w={'full'}>
            {list.map(item =>
                <LoanCard canEdit={false} {...item} tokenInfo={tokenObj[item.ftContract.toLowerCase()]} />
            )}
        </SimpleGrid>
    );
}