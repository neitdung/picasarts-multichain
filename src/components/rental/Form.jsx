import React, { useState, useEffect, useMemo } from 'react';
import {
    useToast,
    Button,
    FormControl,
    FormLabel,
    Switch,
    Image,
    NumberInput,
    NumberInputField,
    Flex,
    VStack,
    Divider,
    Select,
    ButtonGroup
} from "@chakra-ui/react";
import { ethers } from 'ethers';
import NotConnected from '../common/NotConnected';
import { noneAddress, rentalAddress } from 'src/state/chain/config';
import { createNftContractWithSigner } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/rental/thunks/loadContract';
import { useRouter } from 'next/router';

export default function RentalForm({ ipnft, listed }) {
    const [contractAddress, tokenId] = ipnft.split("@");
    const dispatch = useDispatch();
    const { account, tokens } = useSelector(state => state.chain);
    const { signer, loaded, contract } = useSelector(state => state.rental);
    const [isLoading, setIsLoading] = useState(false);
    const [rentalData, setRentalData] = useState({});
    const [tokenIndex, setTokenIndex] = useState(0);
    const [release, setRelease] = useState();
    const [cycleTime, setCycleTime] = useState();
    const [cycleEnded, setCycleEnded] = useState();

    const router = useRouter();
    const toast = useToast();

    const loadRentalData = async () => {
        let data = await contract.getRentalData(contractAddress, tokenId);
        setRentalData(data);

        let tIndex = tokens.list.findIndex(item => item.address.toLowerCase() === data.ftContract.toLowerCase());
        setTokenIndex(tIndex !== -1 ? tIndex : 0);

        if (data?.releaseFrequency) {
            let newVal = ethers.utils.formatUnits(data.releaseFrequency, tokens.list[tIndex].decimal);
            setRelease(newVal);
        }
        if (data?.cycleTime) {
            let newVal = data.cycleTime.toString();
            setCycleTime(newVal)
        }
        if (data?.cycleEnded) {
            let newVal = data.cycleEnded.toString();
            setCycleEnded(newVal)
        }
    }

    const listItem = async () => {
        setIsLoading(true);
        try {
            let releaseDecimal = ethers.utils.parseUnits(release, tokens.list[tokenIndex].decimal);
            let cycleTimeDecimal = ethers.BigNumber.from(cycleTime);
            let cycleEndDecimal = ethers.BigNumber.from(cycleEnded);
            let nftContract = createNftContractWithSigner(contractAddress);
            let approveTx = await nftContract.approve(rentalAddress, tokenId);
            await approveTx.wait();
            let listTx = await signer.list(contractAddress, tokenId, tokens.list[tokenIndex].address, releaseDecimal, cycleTimeDecimal, cycleEndDecimal);
            await listTx.wait();
            toast({
                title: "List NFT success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.reload();
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const editItem = async () => {
        setIsLoading(true);
        try {
            let releaseDecimal = ethers.utils.parseUnits(release, tokens.list[tokenIndex].decimal);
            let cycleTimeDecimal = ethers.BigNumber.from(cycleTime);
            let cycleEndDecimal = ethers.BigNumber.from(cycleEnded);
            let editTx = await signer.edit(rentalData.itemId, tokens.list[tokenIndex].address, releaseDecimal, cycleTimeDecimal, cycleEndDecimal);
            await editTx.wait();
            toast({
                title: "Edit listing NFT success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.reload();
            setIsLoading(false);
        } catch (e) {
            console.log(e)
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const relistItem = async () => {
        setIsLoading(true);
        try {
            let releaseDecimal = ethers.utils.parseUnits(release, tokens.list[tokenIndex].decimal);
            let cycleTimeDecimal = ethers.BigNumber.from(cycleTime);
            let cycleEndDecimal = ethers.BigNumber.from(cycleEnded);
            let nftContract = createNftContractWithSigner(contractAddress);
            let approveTx = await nftContract.approve(rentalAddress, tokenId);
            await approveTx.wait();
            let relistTx = await signer.relist(rentalData.itemId, tokens.list[tokenIndex].address, releaseDecimal, cycleTimeDecimal, cycleEndDecimal);
            await relistTx.wait();
            toast({
                title: "Relist NFT success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.reload();
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const unlist = async () => {
        setIsLoading(true);
        try {
            let unlistTx = await signer.unlist(rentalData.itemId);
            await unlistTx.wait();
            setIsLoading(false);
            toast({
                title: "Unlist NFT success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.reload();
            setIsLoading(false);
        } catch (e) {
            toast({
                title: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }

    const handleTokenChange = (e) => {
        setTokenIndex(e.target.value)
    }

    const canEdit = useMemo(() => {
        if (listed && rentalData?.lender && rentalData?.status == 1) {
            return account == rentalData.lender.toLowerCase();
        }
        return false;
    }, [rentalData, account, listed]);

    useEffect(() => {
        if (loaded) {
            loadRentalData();
        } else {
            dispatch(loadContract())
        }
    }, [loaded]);

    useEffect(() => {
        if (tokens.load && tokens.list.length) {
            setTokenIndex(0)
        }
    }, [tokens.loaded])

    if (!account) return <NotConnected />

    return (
        <VStack bg="white" borderRadius={10} align='left'>
            <Divider />
            <FormControl>
                <FormLabel fontWeight={700}>Token Payment</FormLabel>
                <Select w={'full'} value={tokenIndex} icon={<Image src={tokens.list[tokenIndex].logo} />} onChange={handleTokenChange}>
                    {(tokens.list.length) && tokens.list.map((item, index) => <option ket={item.address} value={index}>{item.name} - {item.symbol}</option>)}
                </Select>
            </FormControl>
            <Flex gap={20} w={'full'}>
                <FormControl id="release">
                    <FormLabel fontWeight={700}>Release frequency</FormLabel>
                    <NumberInput value={release}>
                        <NumberInputField onChange={e => setRelease(e.target.value)} min={0} />
                    </NumberInput>
                </FormControl>
                <FormControl id="cycle-time">
                    <FormLabel fontWeight={700}>Cycle time</FormLabel>
                    <NumberInput value={cycleTime}>
                        <NumberInputField onChange={e => setCycleTime(e.target.value)} min={0} />
                    </NumberInput>
                </FormControl>
                <FormControl >
                    <FormLabel fontWeight={700}>Cycle before stop</FormLabel>
                    <NumberInput value={cycleEnded}>
                        <NumberInputField onChange={e => setCycleEnded(e.target.value)} />
                    </NumberInput>
                </FormControl>
            </Flex>
            {(!listed && rentalData?.nftContract == noneAddress) &&
                <Button isLoading={isLoading} onClick={listItem} w={'50%'} colorScheme='teal' alignSelf='center'>List NFT</Button>
            }
            {(!listed && rentalData?.nftContract != noneAddress) &&
                <Button isLoading={isLoading} onClick={relistItem} w={'50%'} colorScheme='teal' alignSelf='center'>Relist NFT</Button>
            }
            {(canEdit) &&
                <ButtonGroup w={'full'}>
                    <Button onClick={editItem} colorScheme='teal' isLoading={isLoading} w={'full'}>Edit Covenant</Button>
                    <Button w={'full'} variant='outline' colorScheme='red' onClick={unlist} isLoading={isLoading}>Unlist Item</Button>
                </ButtonGroup>
            }
        </VStack>
    );
}