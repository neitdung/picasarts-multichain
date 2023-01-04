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
    Button
} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { createFtContract } from "src/state/hub/utils/helper";
import loadContract from "src/state/market/thunks/loadContract";
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";

export default function TokenHandle() {
    const dispatch = useDispatch();
    const { loaded, signer } = useSelector(state => state.hub);
    const { contract: marketContract, loaded: marketLoaded } = useSelector(state => state.market);
    const [listToken, setListToken] = useState([]);
    const [newToken, setNewToken] = useState('');
    const toast = useToast();

    const loadTokens = async () => {
        let tokens = await marketContract.getAcceptTokens();
        console.log(tokens)
        let convertedTokens = [];
        let namePromises = [];
        let symbolPromises = [];
        for (let i = 0; i < tokens.length; i++) {
            let tokenContract = createFtContract(tokens[i]);
            namePromises.push(tokenContract.name());
            symbolPromises.push(tokenContract.symbol());
        }
        let nameTokens = await Promise.all(namePromises);
        let symbolTokens = await Promise.all(symbolPromises);
        for (let i = 0; i < tokens.length; i++) {
            convertedTokens.push({
                address: tokens[i],
                name: nameTokens[i],
                symbol: symbolTokens[i]
            })
        }
        setListToken(convertedTokens);
    }

    const handleRemoveToken = useCallback(async (index) => {
        try {
            let handleReq = await signer.removeToken(listToken[index].address);
            await handleReq.wait();
            let newList = [...listToken];
            newList.splice(index, 1)
            setListToken(newList);

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
    }, [listToken, signer, loaded])

    const handleAddToken = useCallback(async () => {
        try {
            let handleReq = await signer.addAcceptToken(newToken);
            await handleReq.wait();
            let tokenContract = createFtContract(newToken);
            let name = await tokenContract.name();
            let symbol = await tokenContract.symbol();
            let newList = [...listToken];
            newList.push({
                address: newToken,
                name,
                symbol
            });
            setListToken(newList);
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
    }, [newToken, listToken, signer, loaded])

    useEffect(() => {
        if (!marketLoaded) {
            dispatch(loadContract());
        } else {
            loadTokens()
        }
    }, [marketLoaded])

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
                            {listToken.map((item, index) =>
                                <Tr>
                                    <Td>{item.address}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.symbol}</Td>
                                    <Td><Button colorScheme='red' leftIcon={<CloseIcon />} onClick={() => handleRemoveToken(index)}>Delete</Button></Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}