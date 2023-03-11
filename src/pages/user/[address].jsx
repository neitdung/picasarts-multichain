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
import NftListByUser from 'src/components/nft/ListByUser';


export default function UserPage({address}) {
    const dispatch = useDispatch();
    const { account } = useSelector(state => state.chain);
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [userData, setUserData] = useState({})
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
            setUserData(resJson.data);
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
                    userData.banner ? `http://127.0.0.1:8080/btfs/${userData.banner}` : 'https://picsum.photos/2000/200'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-20}>
                <Avatar
                    src={
                        userData.avatar ? `http://127.0.0.1:8080/btfs/${userData.avatar}` : 'https://picsum.photos/200/200'
                    }
                    size={'2xl'}
                    alt={'Creator'}
                    css={{
                        border: '4px solid white',
                    }}
                />
            </Flex>
            <VStack py={2}>
                <Text fontSize={'xl'} fontWeight={700}>{userData.name}</Text>
                <HStack gap={12} fontSize={'xl'}>
                    <Link href={userData.facebook ? userData.facebook : "#"} color={'blue.500'}><FacebookIcon /></Link>
                    <Link href={userData.instagram ? userData.instagram : "#"} color={'pink.400'}><InstagramIcon /></Link>
                    <Link href={userData.twitter ? userData.twitter : "#"} color={'blue.500'}><TwitterIcon /></Link>
                    <Link href={userData.website ? userData.website : "#"} color={'pink.400'}><ExternalLinkIcon /></Link>
                </HStack>
                <Text border={'1px solid'} px={2} py={1} borderColor={'gray.200'} color={'gray.500'} borderRadius={20}>{account}</Text>
                <Text>{userData.bio}</Text>
            </VStack>
            <Box px={{ base: 4, md: 20 }} my={4}>
                <Tabs isFitted variant={'enclosed'} borderWidth={2} isLazy>
                    <TabList>
                        <Tab>Archived</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <NftListByUser address={address} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            <Divider />
        </Box>
    );
}

UserPage.getInitialProps = async ({ query }) => {
    return {
        address: query.address
    }
}