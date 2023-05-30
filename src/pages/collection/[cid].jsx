import React, { useState, useEffect } from 'react';
import {
    Flex,
    SkeletonCircle,
    SkeletonText,
    Image,
    Box,
    Avatar,
    VStack,
    HStack,
    Link,
    Text,
    SimpleGrid
} from "@chakra-ui/react";

import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NFTCard from 'src/components/nft/Card';
import { noneAddress } from 'src/state/chain/config';
import { useSelector } from 'react-redux';

export default function CollectionCid({ cid }) {
    const { selectedChain, tokens: { obj: tokenObj} } = useSelector(state => state.chain);

    const [list, setList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState({});

    const loadCollection = async () => {
        setIsLoading(true);
        let getReq = await fetch(`/api/collection/get-by-id?chain=${selectedChain}&cid=${cid}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let getResJson = await getReq.json();
        if (!getResJson.error) {
            setInfo(getResJson.data);
            let nftReq = await fetch(`/api/nft/get-by-caddress?chain=${selectedChain}&address=${getResJson.data.contract_address}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let nftRes = await nftReq.json();
            if (!nftRes.error) {
                setList(nftRes.data)
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loadCollection()
    }, []);

    if (isLoading) return <Box padding='6' boxShadow='lg' bg='white'>
        <SkeletonCircle size='30' />
        <SkeletonText mt='4' noOfLines={20} spacing='4' />
    </Box>;

    return (
        <Box>
            <Image
                h={300}
                w={'full'}
                src={
                    info.banner ? `https://fs.picasarts.io/btfs/${info.banner}` : 'https://picsum.photos/2000/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-20}>
                <Avatar
                    src={
                        info.logo ? `https://fs.picasarts.io/btfs/${info.logo}` : 'https://picsum.photos/200/200'
                    }
                    size={'2xl'}
                    alt={'Creator'}
                    css={{
                        border: '4px solid white',
                    }}
                />
            </Flex>
            <VStack py={2}>
                <Text fontSize={'xl'} fontWeight={700}>{info.name}</Text>
                <HStack gap={12} fontSize={'xl'}>
                    <Link href={info.facebook ? info.facebook : "#"} color={'blue.500'}><FacebookIcon /></Link>
                    <Link href={info.instagram ? info.instagram : "#"} color={'pink.400'}><InstagramIcon /></Link>
                    <Link href={info.twitter ? info.twitter : "#"} color={'blue.500'}><TwitterIcon /></Link>
                    <Link href={info.website ? info.website : "#"} color={'pink.400'}><ExternalLinkIcon /></Link>
                </HStack>
                <Text border={'1px solid'} px={2} py={1} borderColor={'gray.200'} color={'gray.500'} borderRadius={20}>{info.owner}</Text>
                <Text>{info.bio}</Text>
            </VStack>
            <SimpleGrid h={'min'} columns={4} gap={5} w={'full'} px={20}>
                {list.map(item =>
                    <NFTCard {...item} canEdit={false} tokenInfo={tokenObj[noneAddress]} />
                )}
            </SimpleGrid>
        </Box>
    );
}

CollectionCid.getInitialProps = async ({ query }) => {
    return {
        cid: query.cid
    }
}