import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    FormControl,
    Input,
    useToast,
    Table,
    Thead,
    Tbody,
    Flex,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    FormLabel,
    FormHelperText,
    InputGroup,
    InputRightAddon,
    InputRightElement,
    Divider
} from '@chakra-ui/react';
import BoxLoading from "../common/BoxLoading";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { config } from "src/state/chain/config";

export default function BaseFee() {

    const dispatch = useDispatch();
    const { contract, loaded } = useSelector(state => state.hub);
    const { selectedChain } = useSelector(state => state.chain);

    const [isLoading, setIsLoading] = useState(false);
    const [editRateFee, setEditRateFee] = useState("0");
    const [editCreateFee, setEditCreateFee] = useState("0");
    const [rateFee, setRateFee] = useState("0");
    const [createFee, setCreateFee] = useState("0");
    const [newChild, setNewChild] = useState("");

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

    useEffect(() => {
        if (loaded) {
            loadFee();
        }
    }, [loaded])

    if (isLoading) return <BoxLoading/>;

    return (
        <Box w='full' px={4} py={2}>
            <Flex gap={4}>
                <FormControl>
                    <FormLabel>CREATE_FEE</FormLabel>
                    <InputGroup>
                        <Input value={editCreateFee} onChange={e => setEditCreateFee(e.target.value)} />
                        <InputRightAddon p={0}><Button colorScheme='red' borderLeftRadius={0} w='full'>UPDATE</Button></InputRightAddon>
                    </InputGroup>
                    <FormHelperText>Current create fee is: {createFee} {config[selectedChain].nativeCurrency.symbol}</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>RATE_FEE</FormLabel>
                    <InputGroup>
                        <Input value={editRateFee} onChange={e => setEditRateFee(e.target.value)} />
                        <InputRightAddon p={0}><Button colorScheme='pink' borderLeftRadius={0} w='full'>UPDATE</Button></InputRightAddon>
                    </InputGroup>
                    <FormHelperText>Current rate fee is: {rateFee} %</FormHelperText>
                </FormControl>
            </Flex>
            <Divider my={4} />
            <FormControl mt={4}>
                <FormLabel>NEW HUB CHILD</FormLabel>
                <InputGroup>
                    <Input value={newChild} onChange={e => setNewChild(e.target.value)} />
                    <InputRightAddon p={0}><Button colorScheme='blue' borderLeftRadius={0} w='full'>Submit</Button></InputRightAddon>
                </InputGroup>
            </FormControl>
        </Box>
    );
}