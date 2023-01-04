import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    FormControl,
    Input,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    FormLabel,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { CloseIcon } from "@chakra-ui/icons";

export default function HubChildren() {
    const { contract, loaded, signer } = useSelector(state => state.hub);
    const toast = useToast();
    const [newChild, setNewChild] = useState("");
    const [listChild, setListChild] = useState([]);

    const loadChildren = useCallback(async () => {
        let childList = await contract.getHubChild();
        setListChild(childList)
    }, [contract])

    const handleAddChild = useCallback(async () => {
        try {
            let handleReq = await signer.addHubChild(newChild);
            await handleReq.wait();
            let newList = [...listChild];
            newList.push(newChild);
            setListChild(newList);
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
    }, [newChild, listChild, signer])

    const handleRemoveChild = useCallback(async (index) => {
        try {
            let handleReq = await signer.removeHubChild(listChild[index]);
            await handleReq.wait();
            let newList = [...listChild];
            newList.splice(index, 1)
            setListChild(newList);

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
    }, [listChild, signer])

    useEffect(() => {
        if (loaded) {
            loadChildren();
        }
    }, [loaded])


    return (
        <Box w='full' px={4} py={2}>
            <FormControl mt={4}>
                <FormLabel>NEW HUB CHILD</FormLabel>
                <InputGroup>
                    <Input value={newChild} onChange={e => setNewChild(e.target.value)} />
                    <InputRightAddon p={0}><Button colorScheme='blue' onClick={handleAddChild} borderLeftRadius={0} w='full'>Submit</Button></InputRightAddon>
                </InputGroup>
            </FormControl>
            <TableContainer borderRadius={10} border='1px' mt={10}>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption placement='top'>List child addresses</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {listChild.map((item, cIndex) =>
                            <Tr>
                                <Td>{item}</Td>
                                <Td><Button leftIcon={<CloseIcon />} colorScheme='red' onClick={_e => handleRemoveChild(cIndex)}>Delete</Button></Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}