import React, { useState, useEffect, useMemo } from 'react';
import {
    useToast,
    Button,
    FormControl,
    FormLabel,
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
import { noneAddress, loanAddress } from 'src/state/chain/config';
import { createNftContractWithSigner } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/loan/thunks/loadContract';
import { useRouter } from 'next/router';

export default function LoanForm({ ipnft, listed }) {
    const [contractAddress, tokenId] = ipnft.split("@");
    const dispatch = useDispatch();
    const { account, tokens } = useSelector(state => state.chain);
    const { signer, loaded, contract } = useSelector(state => state.loan);
    const [isLoading, setIsLoading] = useState(false);
    const [loanData, setLoanData] = useState({});
    const [tokenIndex, setTokenIndex] = useState(0);
    const [amount, setAmount] = useState();
    const [profit, setProfit] = useState();
    const [duration, setDuration] = useState();

    const router = useRouter();
    const toast = useToast();

    const loadLoanData = async () => {
        let data = await contract.getLoanData(contractAddress, tokenId);
        setLoanData(data);

        let tIndex = tokens.list.findIndex(item => item.address.toLowerCase() === data.ftContract.toLowerCase());
        setTokenIndex(tIndex !== -1 ? tIndex : 0);

        if (data?.amount) {
            let newAmount = ethers.utils.formatUnits(data.amount, tokens.list[tIndex].decimal);
            setAmount(newAmount)
        }
        if (data?.profit) {
            let newProfit = ethers.utils.formatUnits(data.profit, tokens.list[tIndex].decimal);
            setProfit(newProfit)
        }
        if (data?.duration) {
            let newDuration = data.duration.toNumber();
            setDuration(newDuration)
        }
    }

    const listItem = async () => {
        setIsLoading(true);
        try {
            let amountDecimal = ethers.utils.parseUnits(amount, tokens.list[tokenIndex].decimal);
            let profitDecimal = ethers.utils.parseUnits(profit, tokens.list[tokenIndex].decimal);
            let nftContract = createNftContractWithSigner(contractAddress);
            let approveTx = await nftContract.approve(loanAddress, tokenId);
            await approveTx.wait();
            let listTx = await signer.list(contractAddress, tokenId, tokens.list[tokenIndex].address, amountDecimal, profitDecimal, duration);
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
            let amountDecimal = ethers.utils.parseUnits(amount, tokens.list[tokenIndex].decimal);
            let profitDecimal = ethers.utils.parseUnits(profit, tokens.list[tokenIndex].decimal);
            let editTx = await signer.edit(loanData.itemId, tokens.list[tokenIndex].address, amountDecimal, profitDecimal, duration);
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
            let unlistTx = await signer.unlist(loanData.itemId);
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
        console.log(listed, loanData)
        if (listed && loanData?.borrower && loanData?.status == 0) {
            return account == loanData.borrower.toLowerCase();
        }
        return false;
    }, [loanData, account, listed]);

    useEffect(() => {
        if (loaded) {
            loadLoanData();
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
                <FormLabel fontWeight={700}>Token Borrow</FormLabel>
                <Select w={'full'} value={tokenIndex} icon={<Image src={tokens.list[tokenIndex].logo} />} onChange={handleTokenChange}>
                    {(tokens.list.length) && tokens.list.map((item, index) => <option ket={item.address} value={index}>{item.name} - {item.symbol}</option>)}
                </Select>
            </FormControl>
            <Flex gap={20} w={'full'}>
                <FormControl id="amount">
                    <FormLabel fontWeight={700}>Amount</FormLabel>
                    <NumberInput value={amount}>
                        <NumberInputField onChange={e => setAmount(e.target.value)} min={0} />
                    </NumberInput>
                </FormControl>
                <FormControl id="profit">
                    <FormLabel fontWeight={700}>Profit</FormLabel>
                    <NumberInput value={profit}>
                        <NumberInputField onChange={e => setProfit(e.target.value)} min={0} />
                    </NumberInput>
                </FormControl>
                <FormControl >
                    <FormLabel fontWeight={700}>Time days</FormLabel>
                    <NumberInput value={duration}>
                        <NumberInputField onChange={e => setDuration(e.target.value)} />
                    </NumberInput>
                </FormControl>
            </Flex>
            {(loanData?.timeExpired?.eq(0) && loanData?.nftContract == noneAddress) &&
                <Button isLoading={isLoading} onClick={listItem} w={'50%'} colorScheme='pink' alignSelf='center'>List NFT</Button>
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