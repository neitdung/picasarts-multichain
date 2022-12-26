import React, { useContext, useState, useEffect } from 'react';
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
import { appStore, createNftContract } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';
import NFTCard from 'src/components/nft/Card';
// import { marketApproval, approveMarket } from 'src/state/market';
// import { approveLoan, loanApproval } from 'src/state/loan';
import marketOption from 'src/public/static/images/marketoption.png';
import loanOption from 'src/public/static/images/loanoption.jpg';
import MarketForm from 'src/components/market/Form';
import LoanForm from 'src/components/loan/Form';
import { addressNone, loanAddress, marketAddress } from 'src/config/contractAddress';
import { loadMetadata } from 'src/state/nft';
export default function NftList({ contractAddress, tokenId }) {
    const { state } = useContext(appStore);
    const { mounted, wallet: { connected }, tokenObj } = state;
    const [displayLoan, setDisplayLoan] = useState(false);
    const [displayMarket, setDisplayMarket] = useState(false);
    const [listedLoan, setListedLoan] = useState(false);
    const [listedMarket, setListedMarket] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState({});

    const loadData = async () => {
        let meta = await loadMetadata(contractAddress, tokenId);
        setMetadata(meta);
        let nftContract = createNftContract(contractAddress);
        let nftOwner = await nftContract.ownerOf(tokenId);
        if (nftOwner == marketAddress) {
            setDisplayMarket(true);
            setListedMarket(true);
        }
        if (nftOwner == loanAddress) {
            setDisplayLoan(true);
            setListedLoan(true);
        }
        setIsLoading(false);
    }

    const handleMarketDisplay = () => {
        setDisplayLoan(false)
        setDisplayMarket(true);
    }

    const handleLoanDisplay = () => {
        setDisplayLoan(true)
        setDisplayMarket(false);
    }

    useEffect(() => {
        loadData();
    }, [mounted])

    if (!mounted || isLoading) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />

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
                <Flex w={'full'} py={12} justify={'center'} gap={20}>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'330px'}
                        w={'full'}
                        bgGradient='linear(to-r, #f5505e, #ef1399)'
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'lg'}
                            mt={-12}
                            pos={'relative'}
                            height={220}
                        >
                            <Image
                                rounded={'lg'}
                                height={220}
                                width={282}
                                objectFit={'cover'}
                                src={marketOption.src}
                            />
                        </Box>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            onClick={handleMarketDisplay}
                            disabled={listedLoan || listedMarket}
                            w={'full'}
                            mt={4}
                        >
                            Market
                        </Button>
                    </Box>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'330px'}
                        w={'full'}
                        bgGradient='linear(to-r, #ef1399, #f5505e)'
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'lg'}
                            mt={-12}
                            pos={'relative'}
                            height={220}
                        >
                            <Image
                                rounded={'lg'}
                                height={220}
                                width={282}
                                objectFit={'cover'}
                                src={loanOption.src}
                            />
                        </Box>
                        <Button fontSize={'sm'}
                            fontWeight={700}
                            onClick={handleLoanDisplay}
                            disabled={listedLoan || listedMarket}
                            w={'full'}
                            mt={4}
                        >
                            Loan
                        </Button>
                    </Box>
                </Flex>
                {(displayMarket) && <MarketForm contractAddress={contractAddress} tokenId={tokenId} />}
                {(displayLoan) && <LoanForm contractAddress={contractAddress} tokenId={tokenId} />}
            </GridItem>
            <GridItem>
                <NFTCard canEdit={true} {...metadata} tokenInfo={tokenObj[addressNone]} />
            </GridItem>
        </Grid>
    );
}

NftList.getInitialProps = async ({ query }) => {
    return {
        contractAddress: query.cAddress,
        tokenId: query.tokenId
    }
}