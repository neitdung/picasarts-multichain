import React, { useContext, useState, useEffect } from 'react';
import {
    Skeleton,
    SimpleGrid,
    Image,
    Box,
    Divider,
    Text,
    Avatar,
    Flex,
    VStack,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Progress,
    ListItem,
    UnorderedList,
    Link,
    NumberInput,
    NumberInputField,
    CircularProgress,
    useToast
} from "@chakra-ui/react";
import { appStore } from 'src/state/app';
import NextLink from 'next/link';
import HammerIcon from 'src/components/icons/Hammer';
import BagIcon from 'src/components/icons/Bag';
import { addressNone, marketAddress } from 'src/config/contractAddress';
import { CheckIcon } from '@chakra-ui/icons';
import { loadMetadata } from 'src/state/nft';
import { ethers } from 'ethers';
import { createFtContractWithSigner } from 'src/state/app';
export default function NftBuy({ contractAddress, tokenId }) {
    const { state, dispatch } = useContext(appStore);
    const {
        mounted,
        wallet: { signer: { _address }, info },
        marketContract,
        collectionContract,
        tokenObj
    } = state;
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [marketData, setMarketData] = useState({});
    const [collectionData, setCollectionData] = useState({});
    const [creatorData, setCreatorData] = useState({});
    const [properties, setProperties] = useState([]);
    const [boostNum, setBoostNum] = useState([]);
    const [boostPer, setBoostPer] = useState([]);
    const [bid, setBid] = useState({})
    const [bidPrice, setBidPrice] = useState(0);
    const [tokenInfo, setTokenInfo] = useState(tokenObj[addressNone]);

    const toast = useToast();
    const loadData = async () => {
        let meta = await loadMetadata(contractAddress, tokenId);
        await loadCollectionData();
        setMetadata(meta);
        if (meta?.hasOwnProperty('creator_address')) {
            await loadCreatorData(meta.creator_address);
        }
        let pros = meta.attributes.filter(item => item.display_type == "");
        let boost_num = meta.attributes.filter(item => item.display_type == "boost_number" || item.display_type == "number");
        let boost_per = meta.attributes.filter(item => item.display_type == "boost_percentage");
        setProperties(pros);
        setBoostNum(boost_num);
        setBoostPer(boost_per);
        let data = await marketContract.obj.getMarketData(contractAddress, tokenId);
        setMarketData(data[0]);
        setTokenInfo(tokenObj[data[0].ftContract])
        if (data[0]?.auction) {
            let bidInfo = data[1];
            let bidder = bidInfo.bidder;
            bidder = bidder == addressNone ? "" : bidder;
            let limit = bidInfo.limitTime;
            let timeEnd = bidInfo.timeEnd.toNumber() * 1000;
            let highestBid = bidInfo.highestBid;
            setBid({ bidder, limit, timeEnd, highestBid })
        }
    }

    const loadCreatorData = async (creator_address) => {
        let dataRes = await fetch(`/api/user/${creator_address}`);
        let dataJson = await dataRes.json();
        setCreatorData(dataJson);
    }

    const loadCollectionData = async () => {
        const cData = await collectionContract.obj.getCollectionByAddress(contractAddress);
        let cMetadata = await fetch(`http://127.0.0.1:8080/btfs/${cData.metadata}`);
        let cMetadataRes = await cMetadata.json();
        setCollectionData({ ...cData, ...cMetadataRes });
    }

    const addBid = async () => {
        setIsLoading(true);

        let currentBid = marketData.price.gt(bid.highestBid) ? marketData.price : bid.highestBid;
        let bigBidPrice = ethers.utils.parseUnits(bidPrice.toString(), tokenInfo.tokenDecimal);
        try {
            if (bigBidPrice.gt(currentBid)) {
                if (marketData.ftContract === addressNone) {
                    await marketContract.obj.addAuctionNft(marketData.itemId, bigBidPrice, { value: bigBidPrice });
                    await loadData();
                    setIsLoading(false);
                    toast({
                        title: "Add new bid success",
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                } else {
                    let erc20 = createFtContractWithSigner(marketData.ftContract);
                    await erc20.approve(
                        marketAddress,
                        bigBidPrice
                    );
                    erc20.once("Approval", async (from, to, value, event) => {
                        await marketContract.obj.addAuctionNft(marketData.itemId, bigBidPrice);
                        setIsLoading(false);
                        await loadData();
                        toast({
                            title: "Add new bid success",
                            status: 'success',
                            duration: 3000,
                            isClosable: true
                        });
                    })
                }
            } else {
                toast({
                    title: "Bid price must higher than current bid",
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            }
            await addInteractCollection(_address, marketData.nftContract, info.interact_collections);
        } catch (_) {
            setIsLoading(false);
        }
    }

    const buyNow = async () => {
        setIsLoading(true);
        try {
            if (marketData.ftContract === addressNone) {
                await marketContract.obj.buyNft(marketData.itemId, { value: marketData.price });
                await addInteractCollection(_address, marketData.nftContract, info.interact_collections);
                toast({
                    title: "Buy nft success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            } else {
                let erc20 = createFtContractWithSigner(marketData.ftContract);
                await erc20.approve(
                    marketAddress,
                    marketData.price
                );
                erc20.once("Approval", async (from, to, value, event) => {
                    await marketContract.obj.buyNft(marketData.itemId);
                    toast({
                        title: "Buy nft success",
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    setIsLoading(false);
                })
            }
        } catch (_) {
            setIsLoading(false);
        }
    }

    const acceptBid = async () => {
        setIsLoading(true);
        try {
            await marketContract.obj.acceptAuctionNft(marketData.itemId);
            await loadData();
            toast({
                title: "Accept nft success",
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        } catch (_) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (mounted && marketContract.loaded && collectionContract.loaded) {
            loadData();
        }
    }, [mounted, marketContract, collectionContract])

    if (!mounted) return <Skeleton h={'80vh'} />

    return (
        <Box>
            <SimpleGrid columns={2} p={20} gap={20}>
                <Box p={5} borderRadius={10} bgColor={metadata?.background_color ? metadata.background_color : 'gray.200'} h={'min'}>
                    {(metadata?.image) ? <Image borderRadius={10} src={metadata.image.replace("ipfs://", "http://127.0.0.1:8080/btfs/")} w={'full'} /> : <Skeleton w={'full'} minH={500} />}
                </Box>
                <VStack gap={4} align={'left'}>
                    <Box>
                        <Text fontSize={'2xl'} fontWeight={700}>{metadata?.name}</Text>
                        <Text>Sell by <NextLink href={`/user/${marketData?.seller}`} passHref><Link fontWeight={700}>{marketData?.seller}</Link></NextLink></Text>
                    </Box>
                    <Divider />
                    <SimpleGrid columns={2} gap={10}>
                        <Box>
                            <Text fontWeight={700} my={2}>Creator</Text>
                            <Flex align={'center'} gap={5}>
                                <Avatar size={'sm'} name='Avatar Creator' src={creatorData?.avatar ? `http://127.0.0.1:8080/btfs/${creatorData?.avatar}` : ""} />
                                <NextLink href={`/artist/${metadata?.creator_address}`} passHref><Link>{metadata?.creator_name}</Link></NextLink>
                            </Flex>
                        </Box>
                        {collectionData && <Box>
                            <Text fontWeight={700} my={2}>Collection</Text>
                            <Flex align={'center'} gap={5}>
                                <Avatar size={'sm'} name='Collection Name' src={collectionData.logo ? `http://127.0.0.1:8080/btfs/${collectionData.logo}` : ""} />
                                <NextLink href={`/collection/${collectionData?.id}`} passHref><Link>{collectionData?.name}</Link></NextLink>
                            </Flex>
                        </Box>
                        }
                    </SimpleGrid>
                    <Box>
                        <Text fontWeight={700} my={2}>Description</Text>
                        <Text>{metadata?.description}</Text>
                    </Box>
                    <SimpleGrid columns={2}>
                        {marketData?.listed && marketData?.auction ?
                            <Box>
                                <Text fontWeight={700} my={2}>Start price: {ethers.utils.formatUnits(marketData?.price, tokenInfo.tokenDecimal)} {tokenInfo.tokenAbbr}</Text>
                                {(bid?.highestBid) && <Text fontWeight={700} my={2}>Current Bid: {ethers.utils.formatUnits(bid.highestBid, tokenInfo.tokenDecimal)} {tokenInfo.tokenAbbr}</Text>}
                                {bid.bidder && <Text my={2}>Bidder: {bid.bidder}</Text>}
                                {
                                    (_address == marketData.seller && bid.bidder) &&
                                    <Button
                                        w={'3xs'}
                                        color={'white'}
                                        bgGradient='linear(to-r, #f5505e, #ef1399)'
                                        onClick={acceptBid}
                                        leftIcon={isLoading ? <CircularProgress size={'20px'} isIndeterminate /> : <CheckIcon />}
                                        _hover={{
                                            bg: 'pink.300',
                                        }}>
                                        Accept
                                    </Button>
                                }
                                <Text my={2}>Time End: {bid.timeEnd ? new Date(bid.timeEnd).toLocaleString() : "Not limited"}</Text>
                                <NumberInput maxW={'3xs'} my={2}>
                                    <NumberInputField min={0} value={bidPrice} onChange={e => setBidPrice(e.target.value)} placeholder='Enter new bid' />
                                </NumberInput>
                                <Button
                                    w={'3xs'}
                                    color={'white'}
                                    bgGradient='linear(to-r, #f5505e, #ef1399)'
                                    onClick={addBid}
                                    disabled={isLoading || _address == marketData?.seller}
                                    leftIcon={isLoading ? <CircularProgress size={'20px'} isIndeterminate /> : <HammerIcon />}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}>
                                    Place a bid
                                </Button>
                            </Box>
                            : <Box>
                                <Text fontWeight={700} my={2}>Price: {marketData?.listed ? ethers.utils.formatUnits(marketData?.price, tokenInfo.tokenDecimal) + " " + tokenInfo.tokenAbbr : "Not listed for sale"}</Text>
                                <Button
                                    w={'3xs'}
                                    color={'white'}
                                    onClick={buyNow}
                                    bgGradient='linear(to-r, #f5505e, #ef1399)'
                                    disabled={isLoading || !marketData?.listed || _address == marketData?.seller}
                                    leftIcon={isLoading ? <CircularProgress size={'20px'} isIndeterminate /> : <BagIcon />} _hover={{
                                        bg: 'pink.300',
                                    }}>
                                    Buy now
                                </Button>
                            </Box>
                        }
                        <Box>
                            <Text fontWeight={700} my={2}>Token Accept</Text>
                            <Image src={tokenInfo.tokenLogo} h={8} />
                        </Box>
                    </SimpleGrid>
                    <Tabs variant='line' colorScheme='red'>
                        <TabList>
                            <Tab>Properties</Tab>
                            <Tab>Boost</Tab>
                            <Tab>Addtional Details</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <SimpleGrid columns={4} gap={5}>
                                    {properties.length ? properties.map(item => <Box bgColor={'purple.50'} px={10} py={5} textAlign={'center'} borderRadius={4} border={'2px solid'} borderColor={'purple.400'}>
                                        <Text my={2} color={'purple.600'} fontWeight={700} textTransform={'uppercase'}>{item.trait_type}</Text>
                                        <Text>{item.value}</Text>
                                    </Box>) : "None"}
                                </SimpleGrid>
                            </TabPanel>
                            <TabPanel>
                                <UnorderedList spacing={6}>
                                    {boostPer.map((item, index) =>
                                        <ListItem key={`boost_num${index}`}>
                                            <Text>{item.trait_type}: {item.value}%</Text><Progress colorScheme={'purple'} hasStripe value={item.value} />
                                        </ListItem>
                                    )}
                                    {boostNum.map((item, index) =>
                                        <ListItem key={`boost_per${index}`}>
                                            <Text >{item.trait_type}: {item.value}</Text><Progress colorScheme={'cyan'} value={item.value} />
                                        </ListItem>
                                    )}
                                </UnorderedList>
                            </TabPanel>
                            <TabPanel>
                                <UnorderedList spacing={4}>
                                    <ListItem>
                                        <Text>Contract address: {contractAddress}</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Token ID: {tokenId}</Text>
                                    </ListItem>
                                    {(metadata?.royalty) &&
                                        <ListItem>
                                            <Text>Royalty: {parseFloat(metadata?.royalty / 100)}%</Text>
                                        </ListItem>}
                                </UnorderedList>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </VStack>
            </SimpleGrid>
            <Divider />
        </Box>
    );
}

NftBuy.getInitialProps = async ({ query }) => {
    return {
        contractAddress: query.cAddress,
        tokenId: query.tokenId
    }
}