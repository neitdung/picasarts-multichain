import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    FormControl,
    Input,
    SkeletonCircle,
    SkeletonText,
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
    Image,
    HStack,
    Text
} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import loadTokens from "src/state/chain/thunks/loadTokens";
import { noneAddress } from "src/state/chain/config";

export default function TokenHandle() {
    const dispatch = useDispatch();
    const { loaded, signer } = useSelector(state => state.hub);
    const { tokens } = useSelector(state => state.chain);

    const [newToken, setNewToken] = useState('');
    const toast = useToast();

    const handleRemoveToken = useCallback(async (index) => {
        try {
            let handleReq = await signer.removeToken(tokens.list[index].address);
            await handleReq.wait();
            await new Promise(resolve => setTimeout(resolve, 3000));
            dispatch(loadTokens());
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
    }, [tokens, signer, loaded])

    const handleAddToken = useCallback(async () => {
        try {
            let handleReq = await signer.addAcceptToken(newToken);
            await handleReq.wait();
            await new Promise(resolve => setTimeout(resolve, 3000));
            dispatch(loadTokens());
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
    }, [newToken, signer, loaded])

    return (
        <Box w='full' py={4}>
            <Box bg="white" p={6} borderRadius={10} mx={20}>
                <Flex gap={2}>
                    <FormControl>
                        <Input
                            id="token_address"
                            placeholder="Add new token address"
                            value={newToken}
                            onChange={e => setNewToken(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme='blue' leftIcon={<PlusSquareIcon />} onClick={() => handleAddToken()} minW={200}>Add</Button>
                </Flex>
                <TableContainer borderRadius={10} border='1px' mt={10}>
                    <Table variant='striped' colorScheme='teal'>
                        <TableCaption placement='top'>List accept tokens</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Address</Th>
                                <Th>Name</Th>
                                <Th>Symbol</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tokens.list.map((item, index) =>
                                <Tr>
                                    <Td>{item.address}</Td>
                                    <Td>{item.name}</Td>
                                    <Td><HStack><Image src={item.logo} h={'30px'} /><Text>{item.symbol}</Text></HStack></Td>
                                    <Td><Button isDisabled={item.address === noneAddress} colorScheme='red' leftIcon={<CloseIcon />} onClick={() => handleRemoveToken(index)}>Delete</Button></Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}