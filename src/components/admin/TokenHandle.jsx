import React, { useState, useEffect } from "react";
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
import {
    useRouter
} from "next/router";

export default function Admin() {
    const [isLoading, setIsLoading] = useState(true);
    const [listToken, setListToken] = useState([]);
    const [newToken, setNewToken] = useState('');
    const toast = useToast();
    const router = useRouter();

    const checkAdmin = async (adminAddress) => {
        let owner = await marketContract.obj.owner();
        return owner == adminAddress;
    }

    const loadAdmin = async (adminAddress) => {
        let isAdmin = await checkAdmin(adminAddress);
        if (isAdmin) {
            setIsLoading(false);
            loadTokens();
        } else {
            router.push("/");
            toast({
                title: 'You are not the admin',
                description: "Please switch to the admin account.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const loadTokenData = async (tokenAddr) => {
        let tokenContract = createFtContractWithSigner(tokenAddr);
        let name = await tokenContract.name();
        let symbol = await tokenContract.symbol();
        return { address: tokenAddr, name, symbol };
    }

    const loadTokens = async () => {
        let tokens = await marketContract.obj.getAcceptTokens();
        let convertedTokens = []
        for (let i = 0; i < tokens.length; i++) {
            let tokenData = await loadTokenData(tokens[i])
            convertedTokens.push(tokenData);
        }
        setListToken(convertedTokens);
    }

    const remove = async (tokenAddr) => {
        await marketContract.obj.removeToken(tokenAddr);
        setTimeout(() => {
            router.reload();
        }, 7000)
    }

    const addToken = async () => {
        await marketContract.obj.addAcceptToken(newToken);
        setTimeout(() => {
            router.reload();
        }, 7000)
    }

    // useEffect(() => {
    //     if (mounted && marketContract.loaded && _address) {
    //         loadAdmin(_address);
    //     }
    // }, [mounted, marketContract, _address]);

    if (isLoading) return <Box padding='6' w='full' boxShadow='lg' bg='white'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
    </Box>;

    return (
        <Box w='full' bg='gray.200' p={20}>
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
                    <Button onClick={() => addToken()} minW={200}>Add</Button>
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
                            {listToken.map(item =>
                                <Tr>
                                    <Td>{item.address}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.symbol}</Td>
                                    <Td><Button onClick={() => remove(item.address)}>Delete</Button></Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}