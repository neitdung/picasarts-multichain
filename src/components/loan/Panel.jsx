import React, { useState, useEffect, useMemo } from 'react';
import {
    SkeletonText,
    Box,
    Text,
    Avatar,
    Flex,
    Button,
    Input,
    ListItem,
    UnorderedList,
    NumberInput,
    NumberInputField,
    SkeletonCircle,
    useToast,
    Center,
    Tag,
    TagLabel,
    TagLeftIcon,
    HStack,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";

import { TimeIcon, MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { createFtContractWithSigner, formatDurationLong, shortenAddress } from 'src/state/util';
import { CheckIcon } from '@chakra-ui/icons';
import { ethers, BigNumber } from 'ethers';
import { noneAddress, config } from 'src/state/chain/config';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/loan/thunks/loadContract';
import { parseDuration } from 'src/state/util';
export default function LoanPanel({ contractAddress, tokenId, owner }) {
    const dispatch = useDispatch();
    const { account, selectedChain, tokens: { obj: tokenObj } } = useSelector(state => state.chain);
    const { contract, signer, loaded } = useSelector(state => state.loan);

    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    const [loanData, setLoanData] = useState({});
    const [proposalData, setProposalData] = useState({});
    const [userHealth, setUserHealth] = useState([0, 0]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isEnded, setIsEnded] = useState(false);
    const [addedProfit, setAddedProfit] = useState(0);
    const [timeAdd, setTimeAdd] = useState("");
    const { loanAddress } = useMemo(() => config[selectedChain], [selectedChain]);

    const toast = useToast();

    const loadData = async () => {
        setIsFirstLoading(true);
        let data = await contract.getLoanData(contractAddress.toLowerCase(), BigNumber.from(tokenId));
        setLoanData(data[0]);
        setProposalData(data[1]);
        const now = new Date().getTime();
        let result = data[0].timeExpired.toNumber() - now / 1000;
        result = result > 0 ? result : 0;
        setTimeLeft(result);
        let userData = await contract.getUserHealth(data[0].borrower);
        setUserHealth([userData[0].toNumber(), userData[0].toNumber()]);
        setIsFirstLoading(false);
        setIsEnded((Date.now() / 1000) > data[0].timeExpired)
    }

    useEffect(() => {
        if (loaded) {
            loadData();
        } else {
            dispatch(loadContract())
        }
    }, [loaded])

    const lend = async () => {
        setIsLoading(true);
        try {
            if (loanData.ftContract != noneAddress) {
                let erc20 = createFtContractWithSigner(loanData.ftContract);
                let approveTx = await erc20.approve(loanAddress, loanData.amount);
                await approveTx.wait();
                let lendTx = await signer.lend(loanData.itemId);
                await lendTx.wait();
                await loadData();
                toast({
                    title: "Accept covenant success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            } else {
                let lendTx = await signer.lend(loanData.itemId, { value: loanData.amount });
                await lendTx.wait();
                toast({
                    title: "Accept covenant success",
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

    const extend = async () => {
        setIsLoading(true);
        try {
            let convertData = parseDuration(timeAdd);

            if (convertData.error) {
                throw { message: "Time add is not approved." };
            }
            let realProfit = ethers.utils.parseUnits(addedProfit, tokenObj[loanData?.ftContract?.toLowerCase()].decimals);
            let extendTx = await signer.extend(loanData.itemId, realProfit, ethers.BigNumber.from(convertData.result));
            await extendTx.wait();
            await loadData();
            toast({
                title: "Add proposal success",
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

    const accept = async () => {
        setIsLoading(true);
        try {
            let acceptTx = await signer.accept(loanData.itemId);
            await acceptTx.wait();
            await loadData();
            toast({
                title: "Accept proposal success",
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

    const payoff = async () => {
        setIsLoading(true);
        try {
            if (loanData.ftContract != noneAddress) {
                let erc20 = createFtContractWithSigner(loanData.ftContract);
                let approveTx = await erc20.approve(loanAddress, loanData.amount.add(loanData.profit));
                await approveTx.wait();
                let payTx = await signer.payoff(loanData.itemId);
                await payTx.wait();
                await loadData();
                toast({
                    title: "Pay off covenant success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            } else {
                let payTx = await signer.payoff(loanData.itemId, { value: loanData.amount.add(loanData.profit)});
                await payTx.wait();
                toast({
                    title: "Pay off covenant success",
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

    const liquidate = async () => {
        setIsLoading(true);
        try {
            let liquidateTx = await signer.liquidate(loanData.itemId);
            await liquidateTx.wait();
            await loadData();
            toast({
                title: "Liquidate success",
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

    if (isFirstLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;
    return (
        <Box>
            <Text fontWeight={700}>Borrower: {loanData?.borrower}</Text>
            <UnorderedList>
                <ListItem>
                    Loans accepted: {userHealth[0]}
                </ListItem>
                <ListItem>
                    Loans liquidated: {userHealth[1]}
                </ListItem>
                <ListItem>
                    Offer: {ethers.utils.formatUnits(loanData?.amount, tokenObj[loanData?.ftContract?.toLowerCase()].decimals)} {tokenObj[loanData?.ftContract?.toLowerCase()].symbol}
                </ListItem>
                <ListItem>
                    Profit: {ethers.utils.formatUnits(loanData?.profit, tokenObj[loanData?.ftContract?.toLowerCase()].decimals)} {tokenObj[loanData?.ftContract?.toLowerCase()].symbol}
                </ListItem>
                <ListItem>
                    Token Logo: <Avatar size='xs' src={tokenObj[loanData?.ftContract?.toLowerCase()].logo} />
                </ListItem>
                <ListItem>
                    Duration: {formatDurationLong(loanData.duration.toNumber())}
                </ListItem>
            </UnorderedList>
            {(loanData.status === 1) &&
                <Box>
                    <HStack my={2}>
                        <Text>Remain time:</Text>
                        <Tag size={'lg'} variant='outline' colorScheme='red' bg={'white'}>
                            <TagLeftIcon boxSize='12px' as={TimeIcon} />
                            <TagLabel>{Math.floor(timeLeft / (60 * 60 * 24))}D:{Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60))}H:{Math.floor((timeLeft % (60 * 60)) / (60))}M</TagLabel>
                        </Tag>
                    </HStack>
                </Box>
            }
            {(loanData?.status == 1 && loanData?.borrower.toLowerCase() != account) &&
                proposalData?.timeExpired &&
                <UnorderedList>
                    <ListItem>
                        Profit Add: {proposalData?.profit && ethers.utils.formatUnits(proposalData?.profit, tokenObj[loanData?.ftContract?.toLowerCase()].decimals)} {tokenObj[loanData?.ftContract?.toLowerCase()].symbol}
                    </ListItem>
                    <ListItem>
                        Time Expired: {proposalData?.timeExpired.gt(0) ? (new Date(proposalData?.timeExpired * 1000).toLocaleString()): "No proposal"}
                    </ListItem>
                </UnorderedList>
            }
            {(loanData?.status == 1 && loanData?.borrower.toLowerCase() == account) &&
                <Box>
                    <Flex w='full' gap={5}>
                        <FormControl>
                            <FormLabel>Profit</FormLabel>
                            <NumberInput value={addedProfit} maxW={'3xs'} my={2}>
                                <NumberInputField min={0} onChange={e => setAddedProfit(e.target.value)} placeholder='Enter add profit' />
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Time extend:</FormLabel>
                            <Input placeholder='Enter time add: 1d 2h 3m 4s' value={timeAdd} onChange={e => setTimeAdd(e.target.value)} />
                        </FormControl>

                    </Flex>
                    <Center gap={5}>
                        <Button isDisabled={isEnded} isLoading={isLoading} colorScheme={'teal'} leftIcon={<PlusSquareIcon />} onClick={extend}>Add Proposal</Button>
                        <Button isDisabled={isEnded} isLoading={isLoading} colorScheme={'red'} leftIcon={<MinusIcon />} onClick={payoff}>Pay Off</Button>
                    </Center>
                </Box>
            }
            {(loanData?.status == 0) && (loanData?.borrower.toLowerCase() != account) && (owner.toLowerCase() == loanAddress.toLowerCase()) && <Center>
                <Button isLoading={isLoading} colorScheme='teal' leftIcon={<CheckIcon />} onClick={lend}>
                Accept Covenant
            </Button>
            </Center>}
            {(loanData?.status == 1 && loanData?.lender.toLowerCase() == account && proposalData?.timeExpired > 0) &&
                <Center>
                    <Button isLoading={isLoading} colorScheme='teal' minW='3xs' leftIcon={<CheckIcon />} onClick={accept}>
                        Accept Proposal
                    </Button>
                </Center>
                }
            {(loanData?.status == 1 && loanData?.lender.toLowerCase() == account) &&
                <Center>
                    <Button isLoading={isLoading} minW='3xs' isDisabled={timeLeft != 0} colorScheme='red' leftIcon={<MinusIcon />} onClick={liquidate}>
                        Liquidate
                    </Button>
                </Center>
                }
        </Box>
    );
}