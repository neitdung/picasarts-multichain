import React, { useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    Button,
    OrderedList,
    ListItem,
    Flex,
    Box,
    Image
} from "@chakra-ui/react";
import NotConnected from 'src/components/common/NotConnected';
import NFTCard from 'src/components/nft/Card';
import MarketForm from 'src/components/market/Form';
import LoanForm from 'src/components/loan/Form';
import { noneAddress, marketAddress, loanAddress, rentalAddress } from 'src/state/chain/config';
import { useSelector } from 'react-redux';
import RentalForm from 'src/components/rental/Form';

export default function NftList({ ipnft }) {
    const { account, tokens: {obj: tokenObj}, selectedChain } = useSelector(state => state.chain);
    const [displayLoan, setDisplayLoan] = useState(false);
    const [displayMarket, setDisplayMarket] = useState(false);
    const [displayRental, setDisplayRental] = useState(false);
    const [listed, setListed] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState({});

    const loadData = async () => {
        setIsLoading(true);
        let getReq = await fetch(`/api/nft/get?chain=${selectedChain}&ipnft=${ipnft}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let getResJson = await getReq.json();
        if (!getResJson.error) {
            setMetadata(getResJson.data)
            switch (getResJson.data.owner.toLowerCase()) {
                case marketAddress:
                    setListed(true)
                    setDisplayMarket(true)
                    break
                case loanAddress:
                    setListed(true)
                    setDisplayLoan(true)
                    break
                case rentalAddress:
                    setListed(true)
                    setDisplayRental(true)
                    break
            }
        }

        setIsLoading(false);
    }

    const handleMarketDisplay = () => {
        setDisplayLoan(false)
        setDisplayRental(false)
        setDisplayMarket(true)
    }

    const handleLoanDisplay = () => {
        setDisplayMarket(false)
        setDisplayRental(false)
        setDisplayLoan(true)
    }

    const handleRentalDisplay = () => {
        setDisplayMarket(false)
        setDisplayLoan(false)
        setDisplayRental(true)
    }

    useEffect(() => {
        loadData();
    }, [])

    if (isLoading) return <Skeleton h={'80vh'} />
    if (!account) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>LIST YOUR NFT</Text>
                </Center>
            </GridItem>
            <GridItem colSpan={2} borderRadius={10} bg={'white'} p={5}>
                <OrderedList fontStyle={'italic'}>
                    <ListItem>List NFT on our marketplace or as a loan covenant</ListItem>
                    <ListItem>Edit your listed every time</ListItem>
                    <ListItem>Unlist if you don't want to sell anymore</ListItem>
                </OrderedList>
                <Flex w={'full'} py={12} justify={'space-around'}>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'220px'}
                        w={'full'}
                        bgGradient='linear(to-r, #f5505e, #ef1399)'
                        boxShadow={'2xl'}
                        rounded={'md'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'md'}
                            mt={-12}
                            pos={'relative'}
                            height={146}
                        >
                            <Image
                                rounded={'md'}
                                height={146}
                                width={188}
                                objectFit={'cover'}
                                src={"/marketoption.png"}
                            />
                        </Box>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            onClick={handleMarketDisplay}
                            colorScheme='whiteAlpha'
                            isDisabled={listed}
                            w={'full'}
                            mt={4}
                        >
                            Market
                        </Button>
                    </Box>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'220px'}
                        w={'full'}
                        bgGradient='linear(to-r, #ef1399, #f5505e)'
                        boxShadow={'2xl'}
                        rounded={'md'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'md'}
                            mt={-12}
                            pos={'relative'}
                            height={146}
                        >
                            <Image
                                rounded={'md'}
                                height={146}
                                width={188}
                                objectFit={'cover'}
                                src={"/loanoption.jpg"}
                            />
                        </Box>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            onClick={handleLoanDisplay}
                            colorScheme='whiteAlpha'
                            isDisabled={listed}
                            w={'full'}
                            mt={4}
                        >
                            Loan
                        </Button>
                    </Box>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'220px'}
                        w={'full'}
                        bgGradient='linear(to-r, #f5505e, #ef1399)'
                        boxShadow={'2xl'}
                        rounded={'md'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'md'}
                            mt={-12}
                            pos={'relative'}
                            height={146}
                        >
                            <Image
                                rounded={'md'}
                                height={146}
                                width={188}
                                objectFit={'cover'}
                                src={"/rentoption.jpeg"}
                            />
                        </Box>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            onClick={handleRentalDisplay}
                            colorScheme='whiteAlpha'
                            isDisabled={listed}
                            w={'full'}
                            mt={4}
                        >
                            Rental
                        </Button>
                    </Box>
                </Flex>
                {(displayMarket) && <MarketForm ipnft={ipnft} listed={listed} />}
                {(displayLoan) && <LoanForm ipnft={ipnft} listed={listed} />}
                {(displayRental) && <RentalForm ipnft={ipnft} listed={listed} />}
                {/* {displayMarket && "merket"}
                {displayLoan && "loan"}
                {displayRental && "rent"} */}

            </GridItem>
            <GridItem>
                <NFTCard canEdit={true} {...metadata} tokenInfo={tokenObj[noneAddress]} />
            </GridItem>
        </Grid>
    );
}

NftList.getInitialProps = async ({ query }) => {
    return {
        ipnft: query.ipnft,
    }
}