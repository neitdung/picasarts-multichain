import React, { useContext, useState } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    useToast,
    Box,
    VStack,
    Flex,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Textarea,
    InputGroup,
    InputRightElement,
    Divider
} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import NotConnected from 'src/components/common/NotConnected';
import CollectionCard from 'src/components/collection/Card';
import ImageUpload from 'src/components/common/ImageUpload';
import FacebookIcon from 'src/components/icons/Facebook';
import InstagramIcon from 'src/components/icons/Instagram';
import TwitterIcon from 'src/components/icons/Twitter';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useFormik } from "formik";
import { uploadBtfs, uploadMetadata } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import loadContract from 'src/state/hub/thunks/loadContract';
import checkArtist from 'src/state/profile/thunks/checkArtist';
import { noneAddress } from 'src/state/chain/config';
import { createNftContract } from 'src/state/util';
export default function CollectionImport() {
    const dispatch = useDispatch();
    const { account } = useSelector(state => state.chain);
    const { signer, contract, loaded } = useSelector(state => state.hub);
    const { isArtist } = useSelector(state => state.profile);

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [editLogo, setEditLogo] = useState(false);
    const [editBanner, setEditBanner] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            symbol: '',
            description: '',
            facebook: '',
            instagram: '',
            twitter: '',
            website: ''
        },
        onSubmit: values => { importCollection(values) }
    });

    const toast = useToast();

    const checkCollection = async () => {
        let isExisted = false;
        if (selectedAddress) {
            const collectionData = await contract.getCollectionByAddress(selectedAddress);
            console.log(collectionData)
            if (collectionData.cid == 0) {
                isExisted = selectedAddress === collectionData.contractAddress;
            } else {
                isExisted = collectionData.contractAddress == noneAddress ? false : true;
            }
        }
        if (!isExisted) {
            const nftContract = createNftContract(selectedAddress);
            let contractOwner = await nftContract.owner();
            if (contractOwner.toLowerCase() == account) {
                toast({
                    title: "Collection can import",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                const name = await nftContract.name();
                const symbol = await nftContract.symbol();
                formik.values.name = name;
                formik.values.symbol = symbol;
                setCanSubmit(true);
            } else {
                toast({
                    title: "You are not owner of this contract",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Collection had been imported",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const importCollection = async (values) => {
        if (isArtist === 2) {
            setIsLoading(true);
            let [uploadedLogo, uploadedBanner] = await Promise.all([
                editLogo ? uploadBtfs(logo) : () => { },
                editBanner ? uploadBtfs(banner) : () => { }
            ]);
            if (editLogo) {
                values.logo = uploadedLogo;
            }
            if (editBanner) {
                values.banner = uploadedBanner;
            }
            let metaHash = await uploadMetadata(values);
            const fee = await contract.getCreateFee();
            let importReq = await signer.listCollection(selectedAddress, metaHash, { value: fee });
            let importRes = await importReq.wait();
            let importEvents = importRes.events;
            toast({
                title: "Create collection success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false); 
            let createEvent = importEvents.find(item => item.event == "CollectionListed");
            if (createEvent) {
                router.push(`/collection/edit/${createEvent.args[0].toString()}`);
            }
        } else {
            toast({
                title: "Please register as artist on profile page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (!loaded) {
            dispatch(loadContract());
        } else {
            dispatch(checkArtist());
        }
    }, [loaded])

    if (!loaded) return <Skeleton h={'80vh'} />
    if (!account) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>IMPORT NEW COLLECTION</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                <Box bg="white" p={6} borderRadius={10} >
                    <Text pb={2}>Please make sure you are owner of contract</Text>
                    <Flex gap={10}>
                        <Input
                            placeholder='Fill your contract address'
                            value={selectedAddress}
                            onChange={e => {
                                setSelectedAddress(e.target.value);
                                setCanSubmit(false);
                            }}
                        />
                        <Button
                            onClick={checkCollection}
                            color={'white'}
                            bgColor='#f5505e'
                            w={'40%'}
                            _hover={{
                                bg: 'pink.300',
                            }}
                        >
                            Search
                        </Button>
                    </Flex>
                    <Divider py={4} />
                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4} pt={4} align="flex-start">
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl isInvalid={!!formik.errors.name}>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        disabled
                                    />
                                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!formik.errors.symbol}>
                                    <FormLabel htmlFor="symbol">Symbol</FormLabel>
                                    <Input
                                        id="symbol"
                                        name="symbol"
                                        value={formik.values.symbol}
                                        onChange={formik.handleChange}
                                        disabled
                                    />
                                    <FormErrorMessage>{formik.errors.symbol}</FormErrorMessage>
                                </FormControl>
                            </Flex>
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl>
                                    <FormLabel htmlFor="logo">Logo</FormLabel>
                                    <Box borderColor={'pink.400'} borderWidth={5} p={5} borderRadius={10} borderStyle={'dashed'}>
                                        <ImageUpload setMedia={setLogo} triggerState={setEditLogo} />
                                    </Box>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="banner">Banner</FormLabel>
                                    <Box borderColor={'pink.400'} borderWidth={5} p={5} borderRadius={10} borderStyle={'dashed'}>
                                        <ImageUpload setMedia={setBanner} triggerState={setEditBanner} />
                                    </Box>
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                            </FormControl>
                            <Text>Social Link</Text>
                            <Flex w={'100%'} gap={12} justify={'space-between'}>
                                <FormControl>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<FacebookIcon color='blue.500' />}
                                        />
                                        <Input
                                            id="facebook"
                                            name="facebook"
                                            value={formik.values.facebook}
                                            onChange={formik.handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<InstagramIcon color='pink.400' />}
                                        />
                                        <Input
                                            id="instagram"
                                            name="instagram"
                                            value={formik.values.instagram}
                                            onChange={formik.handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <InputGroup>
                                        <InputRightElement
                                            pointerEvents='none'
                                            children={<TwitterIcon color='blue.500' />}
                                        />
                                        <Input
                                            id="twitter"
                                            name="twitter"
                                            value={formik.values.twitter}
                                            onChange={formik.handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <InputGroup>
                                    <InputRightElement
                                        pointerEvents='none'
                                        children={<ExternalLinkIcon color='pink.400' />}
                                    />
                                    <Input
                                        id="website"
                                        name="website"
                                        value={formik.values.website}
                                        onChange={formik.handleChange}
                                    />
                                </InputGroup>
                            </FormControl>
                            <Flex w={'full'} gap={12} justify={'center'}>
                                <Button type="submit"
                                    color={'white'}
                                    bgColor='#f5505e'
                                    w={'50%'}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}
                                    disabled={!canSubmit}
                                >
                                    Import
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                </Box>
            </GridItem>
            <GridItem>
                <CollectionCard
                    id=''
                    logo={logo}
                    banner={banner}
                    editLogo={editLogo}
                    editBanner={editBanner}
                />
            </GridItem>
        </Grid>
    );
}