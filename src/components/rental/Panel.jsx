import React, { useState, useEffect, useMemo } from 'react';
import {
    SkeletonText,
    Text,
    Avatar,
    Button,
    ListItem,
    UnorderedList,
    NumberInput,
    NumberInputField,
    SkeletonCircle,
    useToast,
    Box,
    FormControl,
    FormLabel,
    Center,
} from "@chakra-ui/react";
import { DownloadIcon, MinusIcon, PlusSquareIcon, RepeatClockIcon,  CloseIcon } from '@chakra-ui/icons';
import { createFtContractWithSigner, formatDurationLong, shortenAddress } from 'src/state/util';
import { ethers, BigNumber } from 'ethers';
import { noneAddress, config } from 'src/state/chain/config';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/rental/thunks/loadContract';

export default function RentalPanel({ contractAddress, tokenId, owner }) {
    const dispatch = useDispatch();
    const { account, selectedChain, tokens: { obj: tokenObj } } = useSelector(state => state.chain);
    const { contract, signer, loaded } = useSelector(state => state.rental);

    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    const [rentalData, setRentalData] = useState({});
    const [rentingData, setRentingData] = useState({});
    const [timeExpired, setTimeExpired] = useState(0);

    const [isEnded, setIsEnded] = useState(false);
    const [durationCycle, setDurationCycle] = useState(1);
    const { rentalAddress } = useMemo(() => config[selectedChain], [selectedChain]);

    const toast = useToast();

    const loadData = async () => {
        setIsFirstLoading(true);
        let data = await contract.getRentalData(contractAddress.toLowerCase(), BigNumber.from(tokenId));
        setRentalData(data[0]);
        setRentingData(data[1]);
        let newTimeExpired = data[0].cycleTime.mul(data[1].duration).add(data[1].startTime);
        setTimeExpired(newTimeExpired);
        const now = new Date().getTime();
        setIsEnded((now / 1000) > newTimeExpired)
        console.log(data[0], data[1])
        setIsFirstLoading(false);
    }

    useEffect(() => {
        if (loaded) {
            loadData();
        } else {
            dispatch(loadContract())
        }
    }, [loaded])

    const rent = async () => {
        setIsLoading(true);
        try {
            if (rentalData.ftContract != noneAddress) {
                let erc20 = createFtContractWithSigner(rentalData.ftContract);
                let realAmount = rentalData.releaseFrequency.mul(BigNumber.from(parseInt(durationCycle)));
                let approveTx = await erc20.approve(rentalAddress, realAmount);
                await approveTx.wait();
                let rentTx = await signer.rent(rentalData.itemId, realAmount);
                await rentTx.wait();
                await loadData();
                toast({
                    title: "Rent NFT success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            } else {
                let realAmount = rentalData.releaseFrequency.mul(BigNumber.from(parseInt(durationCycle)));
                let rentTx = await signer.rent(rentalData.itemId, realAmount, {value: realAmount});
                await rentTx.wait();
                toast({
                    title: "Rent NFT success",
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

    const topup = async () => {
        setIsLoading(true);
        try {
            if (rentalData.ftContract != noneAddress) {
                let erc20 = createFtContractWithSigner(rentalData.ftContract);
                let realAmount = rentalData.releaseFrequency.mul(BigNumber.from(parseInt(durationCycle)));
                let approveTx = await erc20.approve(rentalAddress, realAmount);
                await approveTx.wait();
                let extendTx = await signer.topup(rentalData.itemId, realAmount);
                await extendTx.wait();
                await loadData();
                toast({
                    title: "Extend rent NFT success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                setIsLoading(false);
            } else {
                let realAmount = rentalData.releaseFrequency.mul(BigNumber.from(parseInt(durationCycle)));
                let extendTx = await signer.topup(rentalData.itemId, realAmount, { value: realAmount });
                await extendTx.wait();
                toast({
                    title: "Extend rent NFT success",
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
    
    const cancel = async () => {
        setIsLoading(true);
        try {
            let canceltx = await signer.cancel(rentalData.itemId);
            await canceltx.wait();
            await loadData();
            toast({
                title: "Cancel rent NFT success",
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
    const withdraw = async () => {
        setIsLoading(true);
        try {
            let withdrawtx = await signer.withdraw(rentalData.itemId);
            await withdrawtx.wait();
            await loadData();
            toast({
                title: "Withdraw rent NFT success",
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

    const stop = async () => {
        setIsLoading(true);
        try {
            let stoptx = await signer.stop(rentalData.itemId);
            await stoptx.wait();
            await loadData();
            toast({
                title: "Stop rent NFT success",
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

    const redeem = async () => {
        setIsLoading(true);
        try {
            let redeemtx = await signer.redeem(rentalData.itemId);
            await redeemtx.wait();
            await loadData();
            toast({
                title: "Redeem rent NFT success",
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
            <Text fontWeight={700}>Lender: {rentalData?.lender}</Text>
            <UnorderedList>
                <ListItem>
                    Release frequency: {ethers.utils.formatUnits(rentalData?.releaseFrequency, tokenObj[rentalData?.ftContract?.toLowerCase()].decimals)} {tokenObj[rentalData?.ftContract?.toLowerCase()].symbol}
                </ListItem>
                <ListItem>
                    Cycle Time: {formatDurationLong(rentalData?.cycleTime.toNumber())}
                </ListItem>
                <ListItem>
                    Cycle before ended: {rentalData?.cycleEnded.toNumber()}
                </ListItem>
                <ListItem>
                    Token Logo: <Avatar size='xs' src={tokenObj[rentalData?.ftContract?.toLowerCase()].logo} />
                </ListItem>
            </UnorderedList>
            {rentingData?.borrower === noneAddress && isEnded ? 
                <Text fontWeight={700}>Borrower : No one rent this NFT</Text>
                : <Box>
                    <Text fontWeight={700}>Borrower: {rentingData?.borrower}</Text>
                    <Text>Start time: {new Date(rentingData.startTime.toNumber() * 1000).toLocaleString()}</Text>
                    <Text>Expired time: {new Date(timeExpired * 1000).toLocaleString()}</Text>
                </Box>
            }
            {
                (account !== rentalData.lender.toLowerCase() && isEnded && (rentalData.status === 1 || rentalData.status === 2)) &&
                <FormControl>
                    <FormLabel>Duration cycle</FormLabel>
                    <NumberInput value={durationCycle} maxW={'3xs'} my={2}>
                        <NumberInputField min={1} onChange={e => setDurationCycle(e.target.value)} placeholder='Enter rent duration cycle' />
                    </NumberInput>
                </FormControl>
            }
            {
                (account !== rentalData.lender.toLowerCase() && isEnded && (rentalData.status === 1 || rentalData.status === 2)) && 
                <Center>
                    <Button minW='3xs' isLoading={isLoading} colorScheme={'teal'} leftIcon={<RepeatClockIcon />} onClick={rent}>Rent</Button>
                </Center>
            }
            {
                (account === rentingData.borrower.toLowerCase() && !isEnded && (rentalData.status === 2 || rentalData.status === 3)) &&
                <Center gap={2}>
                        <Button minW='3xs' isDisabled={rentalData.status === 3} isLoading={isLoading} colorScheme={'blue'} leftIcon={<PlusSquareIcon />} onClick={topup}>Extend</Button>
                        <Button minW='3xs' isLoading={isLoading} colorScheme={'red'} leftIcon={<CloseIcon />} onClick={cancel}>Cancel</Button>
                </Center>
            }
            {
                (account === rentalData.lender.toLowerCase()) &&
                <Center gap={2}>
                        {owner === rentalAddress.toLowerCase() && <Button minW='3xs' isLoading={isLoading} colorScheme={'blue'} leftIcon={<DownloadIcon />} onClick={withdraw}>Withdraw</Button>} 
                    {(!isEnded && rentalData.status === 2) && <Button minW='3xs' isLoading={isLoading} colorScheme={'red'} leftIcon={<CloseIcon />} onClick={stop}>Stop</Button>}
                    {(isEnded && rentalData.status === 3) && <Button minW='3xs' isLoading={isLoading} colorScheme={'red'} leftIcon={<MinusIcon />} onClick={redeem}>Redeem</Button>}
                </Center>
            }
        </Box>
    );
}