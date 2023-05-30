import React, { useEffect } from 'react';
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
import MyNfts from './my-nfts';
// import LoanList from 'src/components/loan/List';
// import MarketList from 'src/components/market/List';
import { useDispatch, useSelector } from 'react-redux';
import getProfile from 'src/state/profile/thunks/getProfile';
import MarketList from 'src/components/market/List';
import LoanList from 'src/components/loan/List';
import LoanListLending from 'src/components/loan/ListLending';
import RentalList from 'src/components/rental/List';
import RentalListRenting from 'src/components/rental/ListRenting';

export default function Collectibles() {
    const dispatch = useDispatch();
    const { account } = useSelector(state => state.chain);
    const { data, isConnecting} = useSelector(state => state.profile);

    useEffect(() => {
        if (!data.loaded) {
            dispatch(getProfile())
        }
    }, [data])
    if (isConnecting || !data.loaded) return <Skeleton h={'80vh'} />
    if (!account) return <NotConnected />

    return (
        <Box>
            <Image
                h={300}
                w={'full'}
                src={
                    data.banner ? `https://fs.picasarts.io/btfs/${data.banner}` : 'https://picsum.photos/2000/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-20}>
                <Avatar
                    src={
                        data.avatar ? `https://fs.picasarts.io/btfs/${data.avatar}` : 'https://picsum.photos/200/200'
                    }
                    size={'2xl'}
                    alt={'Creator'}
                    css={{
                        border: '4px solid white',
                    }}
                />
            </Flex>
            <VStack py={2}>
                <Text fontSize={'xl'} fontWeight={700}>{data.name}</Text>
                <HStack gap={12} fontSize={'xl'}>
                    <Link href={data.facebook ? data.facebook : "#"} color={'blue.500'}><FacebookIcon /></Link>
                    <Link href={data.instagram ? data.instagram : "#"} color={'pink.400'}><InstagramIcon /></Link>
                    <Link href={data.twitter ? data.twitter : "#"} color={'blue.500'}><TwitterIcon /></Link>
                    <Link href={data.website ? data.website : "#"} color={'pink.400'}><ExternalLinkIcon /></Link>
                </HStack>
                <Text border={'1px solid'} px={2} py={1} borderColor={'gray.200'} color={'gray.500'} borderRadius={20}>{account}</Text>
                <Text>{data.bio}</Text>
            </VStack>
            <Box px={{ base: 4, md: 20 }} my={4}>
                <Tabs isFitted variant={'enclosed'} borderWidth={2} isLazy>
                    <TabList>
                        <Tab>Archived</Tab>
                        <Tab>Collections</Tab>
                        <Tab>Market</Tab>
                        <Tab>Loan</Tab>
                        <Tab>Rental</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <MyNfts columns={4} />
                        </TabPanel>
                        <TabPanel>
                            <CollectionList address={account} limit={3} />
                        </TabPanel>
                        <TabPanel>
                            <MarketList address={account} />
                        </TabPanel>
                        <TabPanel>
                            <Center><Text as='mark' fontSize='3xl'>Listing</Text></Center>
                            <LoanList address={account} />
                            <Center><Text as='mark' fontSize='3xl' mx={2}>Lending</Text></Center>
                            <LoanListLending address={account} />
                        </TabPanel>
                        <TabPanel>
                            <Center><Text as='mark' fontSize='3xl'>Listing</Text></Center>
                            <RentalList address={account} />
                            <Center><Text as='mark' fontSize='3xl' mx={2}>Borrowing</Text></Center>
                            <RentalListRenting address={account} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            <Divider />
        </Box>
    );
}