import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Formik, Field } from "formik";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Flex,
    Text,
    Select,
    NumberInput,
    NumberInputField,
    Center,
    Image,
    Skeleton,
    useToast,
    Textarea,
    Switch
} from "@chakra-ui/react";
import { addressNone } from 'src/config/contractAddress';
import NotConnected from 'src/components/common/NotConnected';
import { appStore, getTokens } from 'src/state/app';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import Papa from 'papaparse';

export default function FarmCreate({ }) {
    const [startDate, setStartDate] = useState(new Date());
    const { state, dispatch } = useContext(appStore);
    const { mounted, wallet: { signer, connected }, tokens, collectionContract, farmContract } = state;
    const [nftChosen, setNftChosen] = useState("");
    const [collections, setCollections] = useState([]);
    const [tokenIcon, setTokenIcon] = useState(tokens[0].tokenLogo);
    const [useFile, setUseFile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTokens, setAcceptedTokens] = useState([]);
    const [tokenBalances, setTokenBalances] = useState([]);
    const toast = useToast();
    const router = useRouter();

    const onDrop = useCallback(acceptedFiles => {
        let file = acceptedFiles[0];
        Papa.parse(file, {
            complete: function (results) {
                let result = handleData(results.data);
                if (result.success) {
                    setAcceptedTokens(result.ids);
                    setTokenBalances(result.balances);
                } else {
                    toast({
                        status: 'error',
                        title: 'Data error'
                    })
                }
            }
        });
    }, [])

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        maxFiles: 1,
        maxSize: 10000000,
        onDrop
    });

    const onSubmit = async (values) => {
        setIsLoading(true);
        if (useFile) {
            values.accepted_tokens = acceptedTokens;
            values.balances = tokenBalances;
        } else {
            Papa.parse(values.token_points, {
                complete: function (results) {
                    let result = handleData(results.data);
                    if (result.success) {
                        values.accepted_tokens = result.ids;
                        values.balances = result.balances;
                    } else {
                        toast({
                            status: 'error',
                            title: 'Data error'
                        })
                    }
                }
            });
        }
        let fee = await farmContract.obj.getListingFee();
        if (nftChosen && values.seed_id && values.accepted_tokens.length && values.balances.length) {
            await farmContract.obj.createFarm(
                nftChosen,
                values.accepted_tokens,
                values.balances,
                values.seed_id,
                values.start_at,
                values.rps,
                values.session_interval,
                { value: fee }
            );

            farmContract.obj.once("FarmCreated", async (
                farmId,
                owner,
                nftContract,
                seedId,
                event) => {
                toast({
                    title: "Create success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                farmContract.obj.removeAllListeners("FarmCreated");
                setIsLoading(false);
                router.push(`/farm/${farmId.toString()}`);
            });
        } else {
            toast({
                status: 'error',
                title: 'Data error'
            });
        }
    }

    const handleData = (data) => {
        let tokenIds = [];
        let tokenBalances = [];

        data.forEach(([tokenId, tokenBalance]) => {
            tokenIds.push(tokenId);
            tokenBalances.push(tokenBalance);
        });
        let tokenSet = new Set(tokenIds);
        return { success: tokenSet.size == tokenBalances.length, ids: tokenIds, balances: tokenBalances };
    }

    // useEffect(() => {
    //     if (mounted) {
    //         dispatch(getTokens());
    //     }
    // }, [mounted]);

    const loadCollections = async () => {
        let listCollections = await collectionContract.obj.getCollectionsByOwner(signer._address);
        setCollections(listCollections);
        if (listCollections.length) {
            setNftChosen(listCollections[0].contractAddress);
        }
    }

    useEffect(() => {
        if (mounted && collectionContract.loaded && signer._address) {
            loadCollections();
        }
    }, [mounted, collectionContract, signer._address]);

    if (!mounted) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />
    return (
        <Box bg="white" borderRadius={10} bgColor={'gray.100'} p={20}>
            <Center py={2}>
                <Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)' bgClip='text'>CREATE NEW FARM</Text>
            </Center>
            <Box bgColor={'white'} p={10} borderRadius={20}>
                <Formik
                    initialValues={
                        {
                            seed_id: addressNone,
                            start_at: 0,
                            rps: 1,
                            session_interval: 100,
                            token_points: ''
                        }
                    }
                    onSubmit={onSubmit}
                >
                    {({ values, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="flex-start">
                                <Flex w={'100%'} gap={12} justify={'space-between'}>
                                    <FormControl>
                                        <FormLabel htmlFor="nft_contract">Collection</FormLabel>
                                        <Select
                                            id="nft_contract"
                                            onChange={e => setNftChosen(e.target.value)}
                                            name="nft_contract">
                                            {(collections.length) && collections.map(item => <option key={item.contractAddress} value={item.contractAddress}>{item.contractAddress} - {item.symbol} - {item.name}</option>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="name">Seed ID</FormLabel>
                                        <Field
                                            as={Select}
                                            id="seed_id"
                                            name="seed_id"
                                            icon={<Image src={tokenIcon} />}
                                            onChange={e => {
                                                let token = tokens.find(item => item?.tokenId?.toUpperCase() == e.target.value.toUpperCase());
                                                if (token?.tokenLogo) {
                                                    if (token.tokenLogo.includes("http") || token.tokenLogo.includes("data")) {
                                                        setTokenIcon(token.tokenLogo);
                                                    }
                                                } else {
                                                    setTokenIcon(tokens[0].tokenLogo);
                                                }
                                                values.seed_id = e.target.value;
                                            }}
                                        >
                                            {(tokens.length) && tokens.map(item => <option key={item.tokenId} value={item.tokenId}>{item.tokenAbbr}</option>)}
                                        </Field>
                                    </FormControl>
                                </Flex>
                                <Flex w={'full'} gap={5}>
                                    <FormControl>
                                        <FormLabel htmlFor="start_at">Start At</FormLabel>
                                        <DatePicker dateFormat="Pp" showTimeSelect selected={startDate} onChange={(date) => {
                                            values.start_at = date.getTime() / 1000;
                                            setStartDate(date);
                                        }}
                                            customInput={<Input />}
                                        />
                                        <NumberInput
                                            hidden
                                            defaultValue={0}
                                            min={0}
                                        >
                                            <Field
                                                as={NumberInputField}
                                                id="start_at"
                                                name="start_at"
                                            />
                                        </NumberInput>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="rps">Reward per seed</FormLabel>
                                        <NumberInput
                                            defaultValue={1}
                                            min={1}
                                        >
                                            <Field
                                                as={NumberInputField}
                                                id="rps"
                                                name="rps"
                                            />
                                        </NumberInput>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="session_interval">Session interval (second)</FormLabel>
                                        <NumberInput
                                            defaultValue={100}
                                            min={100}
                                        >
                                            <Field
                                                as={NumberInputField}
                                                id="session_interval"
                                                name="session_interval"
                                            />
                                        </NumberInput>
                                    </FormControl>
                                </Flex>
                                <FormControl>
                                    <Flex gap={2} align='center' mb={2}>
                                        <Text>
                                            Fill your token points or upload csv file
                                        </Text>
                                        <Switch
                                            checked={useFile}
                                            onChange={e => setUseFile(!useFile)}
                                            placeholder='1,1'
                                        />
                                    </Flex>
                                    {useFile ? <Box {...getRootProps({ className: 'dropzone' })} border='1px solid' w='max'>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop csv here, or click to select csv</p>
                                    </Box> : <Field
                                        id="token_points"
                                        as={Textarea}
                                        name="token_points"
                                        placeholder='1,1'
                                    />
                                    }
                                </FormControl>
                                <Flex w={'full'} gap={12} justify={'center'}>
                                    <Button type="submit"
                                        color={'white'}
                                        bgColor='#f5505e'
                                        disabled={isLoading}
                                        w={'50%'}
                                        _hover={{
                                            bg: 'pink.300',
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Flex>
                            </VStack>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
}