import React, { useContext, useState } from 'react';
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
    HStack
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import { appStore } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';
import CollectionList from 'src/components/collection/List';
import MyNfts from './my-nfts';
import LoanList from 'src/components/loan/List';
import MarketList from 'src/components/market/List';

export default function Collectibles() {
    const { state } = useContext(appStore);
    const { mounted, wallet: { info, signer: {_address}, connected } } = state;
    if (!mounted || !info.loaded) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />

    return (
        <Box>
            <Image
                h={300}
                w={'full'}
                src={
                    info.banner ? `http://127.0.0.1:8080/ipfs/${info.banner}` : 'https://picsum.photos/2000/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-20}>
                <Avatar
                    src={
                        info.avatar ? `http://127.0.0.1:8080/ipfs/${info.avatar}` : 'https://picsum.photos/200/200'
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
                <Text border={'1px solid'} px={2} py={1} borderColor={'gray.200'} color={'gray.500'} borderRadius={20}>{_address}</Text>
                <Text>{info.bio}</Text>
            </VStack>
            <Box px={{ base: 4, md: 20 }} my={4}>
                <Tabs isFitted variant={'enclosed'} borderWidth={2}>
                    <TabList>
                        <Tab>Archived</Tab>
                        <Tab>Collections</Tab>
                        <Tab>Listing</Tab>
                        <Tab>Loan</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <MyNfts />
                        </TabPanel>
                        <TabPanel>
                            <CollectionList address={_address} limit={3} />
                        </TabPanel>
                        <TabPanel>
                            <MarketList address={_address} />
                        </TabPanel>
                        <TabPanel>
                            <LoanList address={_address} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            <Divider />
        </Box>
    );
}