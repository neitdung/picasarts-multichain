import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    FormControl,
    Input,
    useToast,
    Flex,
    Button,
    FormLabel,
    FormHelperText,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { config } from "src/state/chain/config";

export default function BaseFee() {

    const dispatch = useDispatch();
    const { contract, signer, loaded } = useSelector(state => state.hub);
    const { selectedChain } = useSelector(state => state.chain);

    const [editRateFee, setEditRateFee] = useState("0");
    const [editCreateFee, setEditCreateFee] = useState("0");
    const [rateFee, setRateFee] = useState("0");
    const [createFee, setCreateFee] = useState("0");

    const toast = useToast();

    const loadFee = useCallback(async () => {
        let cFee = await contract.CREATE_FEE();
        let rFee = await contract.RATE_FEE();
        let rFeeString = (parseFloat(rFee.toString()) / 100).toFixed(2);
        setCreateFee(ethers.utils.formatEther(cFee));
        setRateFee(rFeeString);
        setEditCreateFee(ethers.utils.formatEther(cFee));
        setEditRateFee(rFeeString);
    }, [contract]);

    const handleCreateFee = useCallback(async () => {
        try {
            let handleReq = await signer.setFee(ethers.utils.parseEther(editCreateFee));
            await handleReq.wait();
            setCreateFee(editCreateFee);
            toast({
                status: 'success',
                title: "Transaction is confirmed",
                duration: 3000
            })
        } catch (e) {
            toast({
                status: 'error',
                title: `Error: ${e.message}`,
                duration: 3000
            })
        }
    }, [editCreateFee, signer])

    const handleRateFee = useCallback(async () => {
        try {
            let handleReq = await signer.setRateFee(ethers.BigNumber.from(parseInt(Math.floor(editRateFee * 100))));
            await handleReq.wait();
            setRateFee(editRateFee);
            toast({
                status: 'success',
                title: "Transaction is confirmed",
                duration: 3000
            })
        } catch (e) {
            toast({
                status: 'error',
                title: `Error: ${e.message}`,
                duration: 3000
            })
        }
    }, [editRateFee, signer])

    useEffect(() => {
        if (loaded) {
            loadFee();
        }
    }, [loaded])

    return (
        <Box w='full' px={4} py={2}>
            <Flex gap={4}>
                <FormControl>
                    <FormLabel>CREATE_FEE</FormLabel>
                    <InputGroup>
                        <Input value={editCreateFee} onChange={e => setEditCreateFee(e.target.value)} />
                        <InputRightAddon p={0}><Button colorScheme='red' onClick={handleCreateFee} borderLeftRadius={0} w='full'>UPDATE</Button></InputRightAddon>
                    </InputGroup>
                    <FormHelperText>Current create fee is: {createFee} {selectedChain && config[selectedChain].nativeCurrency.symbol}</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>RATE_FEE</FormLabel>
                    <InputGroup>
                        <Input value={editRateFee} onChange={e => setEditRateFee(e.target.value)} />
                        <InputRightAddon p={0}><Button colorScheme='pink' onClick={handleRateFee} borderLeftRadius={0} w='full'>UPDATE</Button></InputRightAddon>
                    </InputGroup>
                    <FormHelperText>Current rate fee is: {rateFee} %</FormHelperText>
                </FormControl>
            </Flex>
        </Box>
    );
}