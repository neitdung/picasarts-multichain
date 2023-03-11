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
    ButtonGroup,
    Input,
    FormHelperText
} from "@chakra-ui/react";
import { BigNumber, ethers } from 'ethers';
import NotConnected from '../common/NotConnected';
import { noneAddress, config } from 'src/state/chain/config';
import { createNftContractWithSigner, formatDuration, parseDuration } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/loan/thunks/loadContract';
import { useRouter } from 'next/router';

export default function LoanForm({ ipnft, listed }) {
    const [contractAddress, tokenId] = ipnft.split("@");
    const dispatch = useDispatch();
    const { account, tokens, selectedChain } = useSelector(state => state.chain);
    const { loanAddress } = useMemo(() => config[selectedChain], [selectedChain]);

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
        setLoanData(data[0]);

        let tIndex = tokens.list.findIndex(item => item.address.toLowerCase() === data[0].ftContract.toLowerCase());
        setTokenIndex(tIndex !== -1 ? tIndex : 0);

        if (data[0]?.amount) {
            let newAmount = ethers.utils.formatUnits(data[0].amount, tokens.list[tIndex].decimals);
            setAmount(newAmount)
        }
        if (data[0]?.profit) {
            let newProfit = ethers.utils.formatUnits(data[0].profit, tokens.list[tIndex].decimals);
            setProfit(newProfit)
        }
        if (data[0]?.duration) {
            let newDuration = data[0].duration.toNumber();
            setDuration(formatDuration(newDuration))
        }
    }

    const listItem = async () => {
        setIsLoading(true);
        try {
            let convertData = parseDuration(duration);

            if (convertData.error || convertData.result === 0) {
                throw { message: "Duration is not approved." };
            }
            let amountDecimal = ethers.utils.parseUnits(amount, tokens.list[tokenIndex].decimals);
            let profitDecimal = ethers.utils.parseUnits(profit, tokens.list[tokenIndex].decimals);
            let nftContract = createNftContractWithSigner(contractAddress);
            let approveTx = await nftContract.approve(loanAddress, tokenId);
            await approveTx.wait();
            let listTx = await signer.list(contractAddress,
                tokenId,
                tokens.list[tokenIndex].address,
                amountDecimal,
                profitDecimal,
                BigNumber.from(convertData.result));
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
            let convertData = parseDuration(duration);

            if (convertData.error || convertData.result === 0) {
                throw { message: "Duration is not approved."};
            }
            let amountDecimal = ethers.utils.parseUnits(amount, tokens.list[tokenIndex].decimals);
            let profitDecimal = ethers.utils.parseUnits(profit, tokens.list[tokenIndex].decimals);
            let editTx = await signer.edit(loanData.itemId,
                tokens.list[tokenIndex].address,
                amountDecimal,
                profitDecimal,
                BigNumber.from(convertData.result));
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
            </Flex>
            <FormControl>
                <FormLabel fontWeight={700}>Duration</FormLabel>
                <Input value={duration} onChange={e => setDuration(e.target.value)} />
                <FormHelperText>Eg: 1d 2h 3m 4s.</FormHelperText>
            </FormControl>
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