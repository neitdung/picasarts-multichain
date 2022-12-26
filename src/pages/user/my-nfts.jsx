import React, { useContext, useEffect, useState } from 'react';
import {
    SimpleGrid,
    SkeletonCircle,
    SkeletonText,
    Flex,
    Box,
    Select,
    Text
} from "@chakra-ui/react";
import { appStore, createNftContract } from 'src/state/app';
import NFTCard from 'src/components/nft/Card';
import { addressNone } from 'src/config/contractAddress';

export default function MyNfts({ columns }) {
    const { state } = useContext(appStore);
    const { wallet: { signer: { _address }, info: { interact_collections } }, tokenObj } = state;
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [balance, setBalance] = useState(0);
    const [list, setList] = useState([]);
    const [selectAddress, setSelectAddress] = useState("");

    useEffect(() => {
        if (interact_collections?.length) {
            setSelectAddress(interact_collections[0]);
        }
    }, [interact_collections]);

    const handleLoadNft = async (nftAddress) => {
        const nftContract = createNftContract(nftAddress);
        let nftName = await nftContract.name();
        setName(nftName);
        let nftSymbol = await nftContract.symbol();
        setSymbol(nftSymbol);
        let balanceNft = await nftContract.balanceOf(_address);
        let convertBalance = balanceNft.toNumber();
        setBalance(convertBalance);
        let fetchIds = [];
        for (let i = 0; i < convertBalance; i++) {
            fetchIds.push(nftContract.tokenOfOwnerByIndex(_address, i));
        }
        let ids = await Promise.all(fetchIds);
        let mIds = ids.map(item => item.toString());
        fetch(`/api/nft/collection?collection_address=${selectAddress}`,
            { headers: { "content-type": "application/json" } }
        ).then(res => res.json())
            .then(listNft => {
                setList(listNft.filter(item => mIds.includes(item.token_id)));
                setIsLoading(false);
            })
    }

    useEffect(() => {
        if (selectAddress) {
            handleLoadNft(selectAddress)
        }
    }, [selectAddress])
    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;

    return (
        <Box>
            <Flex align='center' gap={4}>
                <Text>Collection:</Text>
                <Select
                    maxW={450}
                    id="contract_address"
                    name="contract_address"
                    onChange={e => setSelectAddress(e.target.value)}
                >
                    {(interact_collections.length) && interact_collections.map((item) => <option key={item} value={item}>{item}</option>)}
                </Select>
            </Flex>
            <Text>Infomation: {name}-{symbol}</Text>
            <Text>Balance: {balance}</Text>
            <SimpleGrid h={'min'} columns={columns ? columns : 4} gap={5} w={'full'} my={2}>
                {list.map(item =>
                    <NFTCard {...item} canEdit={true} tokenInfo={tokenObj[addressNone]} />
                )}
            </SimpleGrid>
        </Box>
    );
}