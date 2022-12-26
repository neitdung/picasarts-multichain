import React, { useContext, useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    Box,
    useToast,
    FormControl,
    FormLabel,
    Select,
    Flex,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Button,
    Link,
    Divider
} from "@chakra-ui/react";
import { appStore, createNftContract } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';

export default function NFTImport() {
    const { state } = useContext(appStore);
    const { mounted, wallet: { connected, signer: { _address } }, collectionContract } = state;
    const [collections, setCollections] = useState([]);
    const [addressIndex, setAddressIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [nftImported, setNftImported] = useState([]);
    const toast = useToast();

    const execute = async () => {
        const range = [...Array(parseInt(endIndex) - parseInt(startIndex) + 1).keys()]
            .map(x => (x + parseInt(startIndex)).toString())
            .filter(item => !nftImported.includes(item));

        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                contract_address: collections[addressIndex].contractAddress,
                list: range
            })
        };
        if (range.length > 0) {
            const result = await fetch("/api/nft/import", options);
            const resultJson = await result.json();
            if (!resultJson.error) {
                toast({
                    title: "Import success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Import failed",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Not valid range",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const handleSelectCollection = async (index) => {
        setAddressIndex(index);
        const nftContract = createNftContract(collections[index].contractAddress);
        const supply = await nftContract.totalSupply();
        setTotalSupply(supply.toNumber());
        const fetchNFTs = await fetch(`/api/nft/imported?address=${collections[index].contractAddress}`, { headers: { "content-type": "application/json" } });
        const jsonNFTs = await fetchNFTs.json();
        setNftImported(jsonNFTs);
    }

    const firstLoadCollection = async (listCollections) => {
        const nftContract = createNftContract(listCollections[0].contractAddress);
        const supply = await nftContract.totalSupply();
        setTotalSupply(supply.toNumber());
        const fetchNFTs = await fetch(`/api/nft/imported?address=${listCollections[0].contractAddress}`, { headers: { "content-type": "application/json" } });
        const jsonNFTs = await fetchNFTs.json();
        setNftImported(jsonNFTs);
    }

    const loadCollections = async () => {
        let listCollections = await collectionContract.obj.getCollectionsByOwner(_address);
        setCollections(listCollections);
        if (listCollections.length > 0) {
            await firstLoadCollection(listCollections);
        }
    }

    useEffect(() => {
        if (mounted && collectionContract.loaded && _address) {
            loadCollections();
        }
    }, [mounted, collectionContract, _address]);

    if (!mounted) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>IMPORT YOUR NFT</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                {(collections.length > 0) ? <Box bg="white" p={6} borderRadius={10} h={'full'}>
                    <FormControl>
                        <FormLabel for="contract_address">Collection</FormLabel>
                        <Select
                            id="contract_address"
                            name="contract_address"
                            onChange={e => handleSelectCollection(e.target.value)}
                        >
                            {(collections.length) && collections.map((item, index) => <option key={item.contractAddress} value={index}>{item.contractAddress} - {item.symbol} - {item.name}</option>)}
                        </Select>
                    </FormControl>
                    <Flex py={2} gap={10}>
                        <FormControl>
                            <FormLabel htmlFor="start_index">Start</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                min={0}
                                max={totalSupply == 0 ? 0 : totalSupply - 1}
                                keepWithinRange={true}
                                onChange={value => {
                                    if (value > endIndex) {
                                        setEndIndex(value);
                                    }
                                    setStartIndex(value);
                                }}
                                value={startIndex}
                            >
                                <NumberInputField
                                    id="start_index"
                                    name="start_index"
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="end_index">End</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                keepWithinRange={true}
                                min={startIndex}
                                max={totalSupply == 0 ? 0 : totalSupply - 1}
                                onChange={value => setEndIndex(value)}
                                value={endIndex}
                            >
                                <NumberInputField
                                    id="end_index"
                                    name="end_index"
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </Flex>
                    <Center py={4}>
                        <Button w={'200px'} onClick={execute}>Run</Button>
                    </Center>
                </Box>
                    : <Box bg="white" p={6} borderRadius={10} h={'full'}>
                        <Text>Please create your own collection to mint new NFT</Text>
                    </Box>}
            </GridItem>
            {(collections.length > 0) &&
                <GridItem>
                    <Box bg="white" p={6} borderRadius={10} h='full'>
                        <Text>Address: {collections[addressIndex].contractAddress}</Text>
                        <Text>Name: {collections[addressIndex].name}</Text>
                        <Text>Symbol: {collections[addressIndex].symbol}</Text>
                        <Text>Owner: {collections[addressIndex].owner}</Text>
                        <Text>Metadata: <Link href={collections[addressIndex].metadata}>link</Link></Text>
                        <Text>Current supply: {totalSupply}</Text>
                        <Text>Imported NFTs: {nftImported.length < 10 ? nftImported.toString() : `${nftImported[0]}-${nftImported[nftImported.length - 1]}`}</Text>
                    </Box>
                </GridItem>
            }
        </Grid>
    );
}