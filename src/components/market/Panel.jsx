import React, { useState, useEffect, useMemo } from 'react';
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
    useToast,
    Center,
    Tag,
    TagLabel,
    TagLeftIcon,
    HStack,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import NextLink from 'next/link';
import HammerIcon from 'src/components/icons/Hammer';
import BagIcon from 'src/components/icons/Bag';
import { TimeIcon, MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { createFtContractWithSigner, shortenAddress } from 'src/state/util';
import { CheckIcon } from '@chakra-ui/icons';
import { ethers, BigNumber } from 'ethers';
import { noneAddress, marketAddress, loanAddress, rentalAddress } from 'src/state/chain/config';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/market/thunks/loadContract';

export default function MarketPanel({ contractAddress, tokenId, owner }) {
    const dispatch = useDispatch();
    const { account, selectedChain, tokens: { obj: tokenObj } } = useSelector(state => state.chain);
    const { contract, signer, loaded } = useSelector(state => state.market);

    const [isLoading, setIsLoading] = useState(false);
    const [marketData, setMarketData] = useState({});
    const [bid, setBid] = useState({});
    const [bidPrice, setBidPrice] = useState(0);
    const [isEndedBid, setIsEndedbid] = useState(false);

    const toast = useToast();

    const loadData = async () => {
        setIsLoading(true);
        let data = await contract.getMarketData(contractAddress.toLowerCase(), BigNumber.from(tokenId));
        setMarketData(data[0]);
        setBid(data[1]);
        setIsLoading(false);
        setIsEndedbid((Date.now() / 1000) > data[1].timeEnd)
    }

    useEffect(() => {
        if (loaded) {
            loadData();
        } else {
            dispatch(loadContract())
        }
    }, [loaded])

    const addBid = async () => {
        setIsLoading(true);

        let currentBid = marketData.price.gt(bid.highestBid) ? marketData.price : bid.highestBid;
        let bigBidPrice = ethers.utils.parseUnits(bidPrice.toString(), tokenObj[marketData?.ftContract.toLowerCase()].decimals);
        try {
            if (bigBidPrice.gt(currentBid)) {
                if (marketData.ftContract === noneAddress) {
                    let buyTx = await signer.addAuction(marketData.itemId, bigBidPrice, { value: bigBidPrice });
                    await buyTx.wait();
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
                    let approveTx = await erc20.approve(
                        marketAddress,
                        bigBidPrice
                    );
                    await approveTx.wait();
                    let buyTx = await signer.addAuction(marketData.itemId, bigBidPrice);
                    await buyTx.wait();
                    await loadData();
                    setIsLoading(false);
                    toast({
                        title: "Add new bid success",
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                }
            } else {
                toast({
                    title: "Bid price must higher than current bid",
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            }
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        }
    }

    const buyNow = async () => {
        setIsLoading(true);
        try {
            if (marketData.ftContract === noneAddress) {
                let buyTx = await signer.buy(marketData.itemId, { value: marketData.price });
                await buyTx.wait();
                toast({
                    title: "Buy nft success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            } else {
                let erc20 = createFtContractWithSigner(marketData.ftContract);
                let approveTx = await erc20.approve(
                    marketAddress,
                    marketData.price
                );
                await approveTx.wait();
                let buyTx = await signer.buy(marketData.itemId);
                await buyTx.wait();
                toast({
                    title: "Buy nft success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            }
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        }
    }

    const acceptBid = async () => {
        setIsLoading(true);
        try {
            let acceptTx = await signer.accept(marketData.itemId);
            await acceptTx.wait();
            await loadData();
            toast({
                title: "Accept nft success",
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        }
    }

    const claimBid = async () => {
        setIsLoading(true);
        try {
            let claimTx = await signer.claimAuction(marketData.itemId);
            await claimTx.wait();
            await loadData();
            toast({
                title: "Claim nft success",
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        }
    }
    return (
        <Box>
            <Text>Seller: {marketData?.seller}</Text>
            <SimpleGrid columns={2} gap={2}>
                {marketData?.listed && marketData?.auction ?
                    <Box>
                        <Text fontWeight={700} my={2}>Start price: {ethers.utils.formatUnits(marketData?.price, tokenObj[marketData?.ftContract.toLowerCase()].decimals)} {tokenObj[marketData?.ftContract.toLowerCase()].symbol}</Text>
                        {(bid?.highestBid) && <Text fontWeight={700} my={2}>Current Bid: {ethers.utils.formatUnits(bid.highestBid, tokenObj[marketData?.ftContract.toLowerCase()].decimals)} {tokenObj[marketData?.ftContract.toLowerCase()].symbol}</Text>}
                        {bid.bidder && <Text my={2}>Bidder: {bid.bidder === noneAddress ? "No one bid" : shortenAddress(bid.bidder)}</Text>}

                        <Text my={2}>Time End: {bid.timeEnd.gt(0) ? new Date(bid.timeEnd * 1000).toLocaleString() : "Not limited"}</Text>
                        <NumberInput maxW={'3xs'} my={2}>
                            <NumberInputField min={0} value={bidPrice} onChange={e => setBidPrice(e.target.value)} placeholder='Enter new bid' />
                        </NumberInput>
                        <Button
                            w={'3xs'}
                            color={'white'}
                            bgGradient='linear(to-r, #f5505e, #ef1399)'
                            onClick={addBid}
                            isDisabled={account === bid.bidder.toLowerCase() || account == marketData?.seller.toLowerCase() || isEndedBid}
                            leftIcon={<HammerIcon />}
                            isLoading={isLoading}>
                            Place a bid
                        </Button>
                        {
                            (account === bid.bidder.toLowerCase() && isEndedBid && bid.timeEnd.gt(0)) &&
                            <Button
                                w={'3xs'}
                                color={'white'}
                                mt={2}
                                bgGradient='linear(to-r, #f5505e, #ef1399)'
                                onClick={claimBid}
                                leftIcon={<HammerIcon />}
                                isLoading={isLoading}>
                                Claim NFT
                            </Button>
                        }
                        {
                            (account == marketData.seller.toLowerCase() && bid.bidder && !marketData.auction) &&
                            <Button
                                w={'3xs'}
                                color={'white'}
                                bgGradient='linear(to-r, #f5505e, #ef1399)'
                                onClick={acceptBid}
                                leftIcon={<CheckIcon />}
                                isLoading={isLoading}
                                _hover={{
                                    bg: 'pink.300',
                                }}>
                                Accept
                            </Button>
                        }
                    </Box>
                    : <Box>
                        <Text fontWeight={700} my={2}>Price: {marketData?.listed ? ethers.utils.formatUnits(marketData?.price, tokenObj[marketData?.ftContract.toLowerCase()].decimals) + " " + tokenObj[marketData?.ftContract.toLowerCase()].symbol : "Not listed for sale"}</Text>
                        <Button
                            w={'3xs'}
                            color={'white'}
                            onClick={buyNow}
                            bgGradient='linear(to-r, #f5505e, #ef1399)'
                            isDisabled={!marketData?.listed || account == marketData?.seller.toLowerCase()}
                            isLoading={isLoading}
                            leftIcon={<BagIcon />}
                        >
                            Buy now
                        </Button>
                    </Box>
                }
                <Box>
                    <Text fontWeight={700} my={2}>Token Accept</Text>
                    <Image src={tokenObj[marketData?.ftContract?.toLowerCase()]?.logo} h={8} />
                </Box>
            </SimpleGrid>
            {/* 
            <Text>Higghest bid: 7 ETH</Text>
            <Text>By: {marketAddress}</Text>
            <Text>Time End: {new Date().toLocaleString()}</Text>
            <NumberInput maxW={'3xs'} my={2}>
                <NumberInputField min={0} placeholder='Enter new bid' />
            </NumberInput>
            <Button
                w={'3xs'}
                color={'white'}
                bgGradient='linear(to-r, #f5505e, #ef1399)'
                // disabled={isLoading || _address == marketData?.seller}
                leftIcon={isLoading ? <CircularProgress size={'20px'} isIndeterminate /> : <HammerIcon />}
                _hover={{
                    bg: 'pink.300',
                }}>
                Place a bid
            </Button> */}
        </Box>
    );
}