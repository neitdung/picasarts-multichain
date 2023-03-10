import React, { useContext, useState, useEffect, useMemo } from 'react';
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
    Tag,
    TagLabel,
    TagLeftIcon,
    NumberInput,
    NumberInputField,
    useToast,
    FormControl
} from "@chakra-ui/react";
import { appStore, createFtContractWithSigner, getTokens } from 'src/state/app';
import NextLink from 'next/link';
import { ethers } from 'ethers';
import { TimeIcon, UnlockIcon, CheckIcon, EditIcon, MinusIcon } from '@chakra-ui/icons';
import { loadMetadata } from 'src/state/nft';
import { addressNone, loanAddress } from 'src/config/contractAddress';

export default function LoanInfo({ id }) {
    const { state, dispatch } = useContext(appStore);
    const {
        mounted,
        wallet: { signer: { _address } },
        loanContract,
        collectionContract,
        tokens
    } = state;
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [loanData, setLoanData] = useState({});
    const [proposal, setProposal] = useState({});
    const [collectionData, setCollectionData] = useState({});
    const [creatorData, setCreatorData] = useState({});
    const [properties, setProperties] = useState([]);
    const [boostNum, setBoostNum] = useState([]);
    const [boostPer, setBoostPer] = useState([]);
    const [addedProfit, setAddedProfit] = useState(0);
    const [timeAdd, setTimeAdd] = useState(0);
    const [loanAccepted, setLoanAccepted] = useState(0);
    const [loanLiquidated, setLoanLiquidated] = useState(0);
    const [tokenInfo, setTokenInfo] = useState(tokens[0]);

    const toast = useToast();
    const loadData = async () => {
        let data = await loanContract.obj.getCovenant(id);
        setLoanData(data[0]);
        setProposal(data[1]);
        let meta = await loadMetadata(data[0].nftContract, data[0].tokenId.toNumber());
        await loadCollectionData(data[0].nftContract);
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
    }

    const loadCreatorData = async (creator_address) => {
        let dataRes = await fetch(`/api/user/${creator_address}`);
        let dataJson = await dataRes.json();
        setCreatorData(dataJson);
    }

    const loadCollectionData = async (cAddress) => {
        const cData = await collectionContract.obj.getCollectionByAddress(cAddress);
        let cMetadata = await fetch(`http://127.0.0.1:8080/btfs/${cData.metadata}`);
        let cMetadataRes = await cMetadata.json();
        setCollectionData({ ...cData, ...cMetadataRes });
    }

    const loadBorrower = async () => {
        let userHealth = await loanContract.obj.getUserHealth(loanData.borrower);
        setLoanAccepted(userHealth[0].toNumber());
        setLoanLiquidated(userHealth[1].toNumber());
    }

    const acceptLoanCovenant = async () => {
        setIsLoading(true);
        try {
            if (loanData.ftContract != addressNone) {
                const ftSigner = createFtContractWithSigner(loanData.ftContract);
                await ftSigner.approve(loanAddress, loanData.amount);
                ftSigner.once("Approval", async (from, to, value, event) => {
                    await loanContract.obj.acceptCovenant(id);
                    await loadData();
                    toast({
                        title: "Accept covenant success",
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    setIsLoading(false);
                })
            } else {
                await loanContract.obj.acceptCovenant(id, { value: loanData.amount });
            }
        } catch (e) {
            toast({
                title: "Error",
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            console.log(e)
            setIsLoading(false);
        }
    }

    const editLoanProposal = async () => {
        setIsLoading(true);
        try {
            let realProfit = ethers.utils.parseUnits(addedProfit, tokenInfo.decimals);
            await loanContract.obj.editProposal(id, realProfit, ethers.BigNumber.from(timeAdd));
            await loadData();
            toast({
                title: "Edit proposal success",
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        } catch (_) {
            setIsLoading(false);
        }
    }

    const acceptLoanProposal = async () => {
        setIsLoading(true);
        try {
            await loanContract.obj.acceptProposal(id);
            await loadData();
            toast({
                title: "Accept proposal success",
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            setIsLoading(false);
        } catch (_) {
            setIsLoading(false);
        }
    }

    const payOffLoan = async () => {
        setIsLoading(true);
        try {
            if (loanData.ftContract != addressNone) {
                const ftSigner = createFtContractWithSigner(loanData.ftContract);
                await ftSigner.approve(loanAddress, loanData.amount.add(loanData.profit));
                ftSigner.once("Approval", async (from, to, value, event) => {
                    await loanContract.obj.payOff(id);
                    await loadData();
                    toast({
                        title: "PayOff success",
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    setIsLoading(false);
                });
            } else {
                await loanContract.obj.payOff(id, { value: loanData.amount.add(loanData.profit) });
            }
        } catch (e) {
            console.log(e)
            setIsLoading(false);
        }
    }

    const liquidateLoan = async () => {
        setIsLoading(true);
        try {
            await loanContract.obj.liquidate(id);
            await loadData();
            toast({
                title: "Liquidate success",
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
        if (mounted && loanContract.loaded && collectionContract.loaded) {
            loadData();
            // dispatch(getTokens());
        }
    }, [mounted, loanContract, collectionContract])

    useEffect(() => {
        if (loanContract.address && loanData?.borrower) {
            loadBorrower()
        }
    }, [loanContract, loanData])

    useEffect(() => {
        if (tokens.length) {
            let tokenIndex = tokens.findIndex(item => item?.tokenId?.toUpperCase() == loanData?.ftContract?.toUpperCase());
            if (tokenIndex != -1) {
                setTokenInfo(tokens[tokenIndex]);
            }
        }
    }, [mounted, tokens, loanData]);

    const timeLeft = useMemo(() => {
        const now = new Date().getTime();
        if (loanData?.timeExpired * 1000 > now) {
            return loanData?.timeExpired * 1000 - now;
        }
        return 0;
    }, [loanData]);

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
                        {(loanData?.status == 0) &&
                            <Tag size={'lg'} variant='outline' colorScheme='purple' bg={'white'}>
                                <TagLeftIcon boxSize='12px' as={UnlockIcon} />
                                <TagLabel>--:--:--</TagLabel>
                            </Tag>}
                        {(loanData?.status == 1) &&
                            <Tag size={'lg'} variant='outline' colorScheme='red' bg={'white'}>
                                <TagLeftIcon boxSize='12px' as={TimeIcon} />
                                <TagLabel>{Math.floor(timeLeft / (1000 * 60 * 60 * 24))}D:{Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}H:{Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}M</TagLabel>
                            </Tag>
                        }
                    </Box>
                    <Divider />
                    <Box>
                        <Text>Listed by <NextLink href={`/user/${loanData.borrower}`} passHref><Link fontWeight={700}>{loanData.borrower}</Link></NextLink></Text>
                        <UnorderedList>
                            <ListItem>
                                Loans accepted: {loanAccepted}
                            </ListItem>
                            <ListItem>
                                Loans liquidated: {loanLiquidated}
                            </ListItem>
                        </UnorderedList>
                    </Box>
                    <Divider />
                    <SimpleGrid columns={2}>
                        <Box>
                            <Text fontWeight={700}>Loan covenant</Text>
                            <UnorderedList>
                                <ListItem>
                                    Offer: {loanData?.amount && ethers.utils.formatUnits(loanData.amount, tokenInfo.tokenDecimal)} {tokenInfo?.tokenAbbr}
                                </ListItem>
                                <ListItem>
                                    Profit: {loanData?.profit && ethers.utils.formatUnits(loanData.profit, tokenInfo.tokenDecimal)} {tokenInfo?.tokenAbbr}
                                </ListItem>
                                <ListItem>
                                    Token Info: <Link target={'blank'}
                                        href={`#`}>
                                        {tokenInfo?.tokenAbbr}
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    Duration: {loanData?.duration?.toNumber()} days
                                </ListItem>
                            </UnorderedList>
                        </Box>
                        <Box>
                            {(loanData?.status == 1) && <Text fontWeight={700}>Loan proposal</Text>}
                            {(loanData?.status == 1 && loanData?.borrower != _address) &&
                                proposal?.timeExpired &&
                                <UnorderedList>
                                    <ListItem>
                                        Profit Add: {proposal?.profit && ethers.utils.formatUnits(proposal.profit, tokenInfo.tokenDecimal)} {tokenInfo?.tokenAbbr}
                                    </ListItem>
                                    <ListItem>
                                        Time Expired: {new Date(proposal?.timeExpired * 1000).toDateString()}
                                    </ListItem>
                                </UnorderedList>
                            }
                            {(loanData?.status == 1 && loanData?.borrower == _address) &&
                                <FormControl>
                                    <NumberInput maxW={'3xs'} my={2}>
                                        <NumberInputField min={0} value={addedProfit} onChange={e => setAddedProfit(e.target.value)} placeholder='Enter add profit' />
                                    </NumberInput>
                                    <NumberInput maxW={'3xs'} my={2}>
                                        <NumberInputField min={0} value={timeAdd} onChange={e => setTimeAdd(e.target.value)} placeholder='Enter time add (days)' />
                                    </NumberInput>
                                </FormControl>
                            }
                        </Box>
                        {(loanData?.status == 0) && (loanData?.borrower != _address) && <Button onClick={acceptLoanCovenant} leftIcon={<CheckIcon />}>
                            Accept Covenant
                        </Button>}
                        {(loanData?.status == 1 && loanData?.lender == _address && proposal?.timeExpired > 0) && <Button onClick={acceptLoanProposal} leftIcon={<CheckIcon />}>
                            Accept Proposal
                        </Button>}
                        {(loanData?.status == 1) && (loanData?.borrower == _address) && <Button onClick={editLoanProposal} leftIcon={<EditIcon />}>
                            Edit Proposal
                        </Button>}
                        {(loanData?.status == 1) && (loanData?.borrower == _address) && <Button onClick={payOffLoan} disabled={timeLeft == 0} leftIcon={<MinusIcon />}>
                            Pay Off
                        </Button>}
                        {(loanData?.status == 1 && loanData?.lender == _address) && <Button onClick={liquidateLoan} disabled={timeLeft != 0} leftIcon={<MinusIcon />}>
                            Liquidate
                        </Button>}
                    </SimpleGrid>
                    <Divider />
                    <SimpleGrid columns={2} gap={10}>
                        <Box>
                            <Text fontWeight={700} my={2}>Creator</Text>
                            <Flex align={'center'} gap={5}>
                                <Avatar size={'sm'} name='Avatar Creator' src={creatorData?.avatar ? `http://127.0.0.1:8080/btfs/${creatorData?.avatar}` : ""} />
                                <NextLink href={`/artist/${metadata?.creatorAddress}`} passHref><Link>{metadata?.creator_name}</Link></NextLink>
                            </Flex>
                        </Box>
                        {collectionData?.id && <Box>
                            <Text fontWeight={700} my={2}>Collection</Text>
                            <Flex align={'center'} gap={5}>
                                <Avatar size={'sm'} name='Collection Name' src={collectionData.logo ? gateway + collectionData.logo : ""} />
                                <NextLink href={`/collection/${collectionData?.id}`} passHref><Link>{collectionData?.name}</Link></NextLink>
                            </Flex>
                        </Box>
                        }
                    </SimpleGrid>
                    <Box>
                        <Text fontWeight={700} my={2}>Description</Text>
                        <Text>{metadata?.description}</Text>
                    </Box>
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
                                        <Text>Contract address: {loanData?.nftContract}</Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text>Token ID: {metadata.token_id}</Text>
                                    </ListItem>
                                    {(metadata?.royalty) &&
                                        <ListItem>
                                            <Text>Royalty: {parseFloat(metadata?.royalty/100)}%</Text>
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

LoanInfo.getInitialProps = async ({ query }) => {
    return {
        id: query.id,
    }
}