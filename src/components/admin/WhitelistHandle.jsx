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
    Button
} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import loadContract from "src/state/market/thunks/loadContract";
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { BigNumber } from "ethers";

export default function WhitelistHandle() {
    const dispatch = useDispatch();
    const { loaded, signer } = useSelector(state => state.hub);
    const { contract: marketContract, loaded: marketLoaded } = useSelector(state => state.market);
    const [listAddr, setListAddr] = useState([]);
    const [newAddr, setNewAddr] = useState('');
    const [newFee, setNewFee] = useState('');
    const toast = useToast();

    const loadAddrs = async () => {
        let addrs = await marketContract.getWhitelist();
        setListAddr(addrs);
    }

    const handleRemoveAddr = useCallback(async (index) => {
        try {
            let handleReq = await signer.removeWhitelistAddress(listAddr[index].address);
            await handleReq.wait();
            let newList = [...listAddr];
            newList.splice(index, 1)
            setListAddr(newList);

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
    }, [listAddr, signer, loaded])

    const handleAddAddr = useCallback(async () => {
        try {
            let handleReq = await signer.addWhitelistAddress(newAddr, BigNumber.from(parseInt(newFee * 100)));
            await handleReq.wait();
            let newList = [...listAddr];
            newList.push({
                addr: newAddr,
                fee: BigNumber.from(parseInt(newFee * 100)),
            });
            setListAddr(newList);
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
    }, [newAddr, newFee, listAddr, signer, loaded])

    useEffect(() => {
        if (!marketLoaded) {
            dispatch(loadContract());
        } else {
            loadAddrs()
        }
    }, [marketLoaded])

    return (
        <Box w='full' py={4}>
            <Box bg="white" borderRadius={10}>
                <Flex gap={2}>
                    <FormControl>
                        <Input
                            id="new_addr"
                            placeholder="Add new whitelist address"
                            value={newAddr}
                            onChange={e => setNewAddr(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            id="new_fee"
                            placeholder="Whitelist fee"
                            value={newFee}
                            type='number'
                            onChange={e => setNewFee(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme='blue' leftIcon={<PlusSquareIcon />} onClick={() => handleAddAddr()} minW={200}>Add</Button>
                </Flex>
                <TableContainer borderRadius={10} border='1px' mt={10}>
                    <Table variant='striped' colorScheme='teal'>
                        <TableCaption placement='top'>List whitelist addresses</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Address</Th>
                                <Th>Fee</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {listAddr.map((item, index) =>
                                <Tr>
                                    <Td>{item.addr}</Td>
                                    <Td>{item.fee.toNumber() / 100} %</Td>
                                    <Td><Button colorScheme='red' leftIcon={<CloseIcon />} onClick={() => handleRemoveAddr(index)}>Delete</Button></Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}