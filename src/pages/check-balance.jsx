import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { noneAddress, config } from "src/state/chain/config";
import { createFtContract } from "src/state/util";
import { ethers } from "ethers";

export default function CheckBalance() {

    const { tokens, selectedChain } = useSelector(state => state.chain);
    const [isFirstLoading, setIsFirstLoading] = useState();

    const [listBalance, setListBalance] = useState([]);
    const [listToken, setListToken] = useState([]);
    const { marketAddress, loanAddress, rentalAddress, hubAddress } = useMemo(() => config[selectedChain], [selectedChain]);

    const loadData = async () => {
        setIsFirstLoading(true)
        let tokenList = tokens.list.filter(item => item.address !== noneAddress);
        let promises = [];
        for (let i = 0; i < tokenList.length; i++) {
            let erc20 = createFtContract(tokenList[i].address);
            promises.push(erc20.balanceOf(hubAddress))
            promises.push(erc20.balanceOf(marketAddress))
            promises.push(erc20.balanceOf(loanAddress))
            promises.push(erc20.balanceOf(rentalAddress))
        }
        let values = await Promise.all(promises);
        let convertValues = [];

        for (let i = 0; i < tokenList.length; i++) {
            convertValues.push({
                hub: ethers.utils.formatUnits(values[i], tokenList[i].decimals),
                market: ethers.utils.formatUnits(values[i+1], tokenList[i].decimals),
                loan: ethers.utils.formatUnits(values[i+2], tokenList[i].decimals),
                rental: ethers.utils.formatUnits(values[i+3], tokenList[i].decimals)
            })
        }
        setListBalance(convertValues)
        setListToken(tokenList);
        setIsFirstLoading(false)
    }
    useEffect(() => {
        if (tokens.loaded) {
            loadData()
        }
    }, [tokens])

    if(isFirstLoading) return <Box>Is Loading</Box>
    return (
        <Box w='full' py={4}>
            <Box bg="white" p={6} borderRadius={10} mx={20}>
                <TableContainer borderRadius={10} border='1px' mt={10}>
                    <Table variant='striped' colorScheme='teal'>
                        <TableCaption placement='top'>List balance</TableCaption>
                        <Thead>
                            <Tr key={`balance`}>
                                <Th>Token</Th>
                                <Th>Hub</Th>
                                <Th>Market</Th>
                                <Th>Loan</Th>
                                <Th>Rental</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {listBalance.map((item, index) =>
                                <Tr key={`balance-${index}`}>
                                    <Td>{listToken[index].symbol}</Td>
                                    <Td>{item.hub}</Td>
                                    <Td>{item.market}</Td>
                                    <Td>{item.loan}</Td>
                                    <Td>{item.rental}</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}