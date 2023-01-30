import React, { useContext, useState, useEffect } from 'react';
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

import { appStore } from 'src/state/app';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NFTCard from 'src/components/nft/Card';
import { getCollectionItems } from 'src/state/collection';
import { addressNone } from 'src/config/contractAddress';

export default function CollectionCid({ cid }) {
    const { state } = useContext(appStore);
    const { mounted, collectionContract, tokenObj } = state;
    const [list, setList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState({});

    const loadCollection = async () => {
        setIsLoading(true);
        let cData = await collectionContract.obj.getCollectionData(cid);
        let cMetadata = await fetch(`http://127.0.0.1:8080/btfs/${cData.metadata}`);
        let cMetadataRes = await cMetadata.json();
        setInfo({ ...cData, ...cMetadataRes });
        let nfts = await getCollectionItems(cData.contractAddress);
        setList(nfts)
        setIsLoading(false);
    }

    useEffect(() => {
        if (mounted && collectionContract.loaded) {
            loadCollection();
        }
    }, [mounted, collectionContract]);

    if (!mounted || isLoading) return <Box padding='6' boxShadow='lg' bg='white'>
        <SkeletonCircle size='30' />
        <SkeletonText mt='4' noOfLines={20} spacing='4' />
    </Box>;

    return (
        <Box>
            <Image
                h={300}
                w={'full'}
                src={
                    info.banner ? `http://127.0.0.1:8080/btfs/${info.banner}` : 'https://picsum.photos/2000/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-20}>
                <Avatar
                    src={
                        info.logo ? `http://127.0.0.1:8080/btfs/${info.logo}` : 'https://picsum.photos/200/200'
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
                    <NFTCard {...item} canEdit={false} tokenInfo={tokenObj[addressNone]} />
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