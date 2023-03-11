import React, { useEffect, useState } from 'react';
import {
    Box,
    Link,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    VStack,
    Flex,
    Text,
    Image,
    Skeleton,
    Avatar,
    Divider,
    HStack,
    Center
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import NotConnected from 'src/components/common/NotConnected';
import CollectionList from 'src/components/collection/List';
import { useDispatch, useSelector } from 'react-redux';
import NftListByArtist from 'src/components/nft/ListByArtist';


export default function ArtistPage({address}) {
    const dispatch = useDispatch();
    const { selectedChain } = useSelector(state => state.chain);
    const { account } = useSelector(state => state.chain);
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [artistData, setArtistData] = useState({})
    const [isError, setIsError] = useState(false);

    const loadData = async () => {
        try {
            let res = await fetch(`/api/user/${address}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            let resJson = await res.json();
            if (resJson.error) {
                setIsError(true)
            }
            setArtistData(resJson.data);
        } catch (e) {
            console.log(e.message)
            setIsError(true);
        }
        setIsFirstLoading(false);
    }
    useEffect(() => {
        loadData()
    }, [])

    if (isFirstLoading) return <Skeleton h={'80vh'} />
    if (isError) return <NotConnected />

    return (
        <Box>
            <Image
                h={300}
                w={'full'}
                src={
                    artistData.banner ? `http://127.0.0.1:8080/btfs/${artistData.banner}` : 'https://picsum.photos/2000/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-20}>
                <Avatar
                    src={
                        artistData.avatar ? `http://127.0.0.1:8080/btfs/${artistData.avatar}` : 'https://picsum.photos/200/200'
                    }
                    size={'2xl'}
                    alt={'Creator'}
                    css={{
                        border: '4px solid white',
                    }}
                />
            </Flex>
            <VStack py={2}>
                <Text fontSize={'xl'} fontWeight={700}>{artistData.name}</Text>
                <HStack gap={12} fontSize={'xl'}>
                    <Link href={artistData.facebook ? artistData.facebook : "#"} color={'blue.500'}><FacebookIcon /></Link>
                    <Link href={artistData.instagram ? artistData.instagram : "#"} color={'pink.400'}><InstagramIcon /></Link>
                    <Link href={artistData.twitter ? artistData.twitter : "#"} color={'blue.500'}><TwitterIcon /></Link>
                    <Link href={artistData.website ? artistData.website : "#"} color={'pink.400'}><ExternalLinkIcon /></Link>
                </HStack>
                <Text border={'1px solid'} px={2} py={1} borderColor={'gray.200'} color={'gray.500'} borderRadius={20}>{account}</Text>
                <Text>{artistData.bio}</Text>
            </VStack>
            <Box px={{ base: 4, md: 20 }} my={4}>
                <Tabs isFitted variant={'enclosed'} borderWidth={2} isLazy>
                    <TabList>
                        <Tab>Collections</Tab>
                        <Tab>Created</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <CollectionList address={address} />
                        </TabPanel>
                        <TabPanel>
                            <NftListByArtist address={address} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            <Divider />
        </Box>
    );
}

ArtistPage.getInitialProps = async ({ query }) => {
    return {
        address: query.address
    }
}