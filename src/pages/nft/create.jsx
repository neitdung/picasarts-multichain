import React, { useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    Box,
    useToast
} from "@chakra-ui/react";
// import {  addInteractCollection, appStore, createNftContractWithSigner } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';
import NFTCard from 'src/components/nft/Card';
import NFTForm from 'src/components/nft/Form';
import { noneAddress } from 'src/state/chain/config';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/hub/thunks/loadContract';
import getProfile from 'src/state/profile/thunks/getProfile';
import { uploadBtfs, uploadMetadata, createNftContractWithSigner } from 'src/state/util';
import { useRouter } from 'next/router';

export default function NFTCreate() {
    const router = useRouter();
    const dispatch = useDispatch();
    const account = useSelector(state => state.chain.account);
    const tokens = useSelector(state => state.chain.tokens);

    const profile = useSelector(state => state.profile);
    const { contract, loaded } = useSelector(state => state.hub);
    const [bg, setBg] = useState('#888888');
    const [attributes, setAttributes] = useState([]);
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [collections, setCollections] = useState([]);
    const initialValues = {
        contract_address: '',
        name: '',
        description: '',
        image: '',
        external_url: '',
        attributes: [],
        royalty: 0
    };

    const toast = useToast();

    const createNFT = async (values) => {
        setIsLoading(true);
        let contractSelected = '';
        if (values.contract_address == '' || collections.length == 1) {
            contractSelected = collections[0].contractAddress;
        } else {
            contractSelected = values.contract_address;
        }
        const metadata = await saveNFTToBtfs(contractSelected, values);
        await saveNFTToContract(contractSelected, metadata, values);
    }

    const saveNFTToBtfs = async (contractSelected, values) => {
        const imageHash = await uploadBtfs(image);
        const metadataHash = await uploadMetadata({ ...values, contract_address: contractSelected, background_color: bg, creator_address: account, image: imageHash })
        return metadataHash;
    }

    const saveNFTToContract = async (contractSelected, metadata, values) => {
        try {
            const nftContract = createNftContractWithSigner(contractSelected);
            let tx = await nftContract.safeMint(
                account,
                metadata,
                parseInt(values.royalty * 100)
            );
            let createResults = await tx.wait();
            toast({
                title: "Create success",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            let createEvents = createResults.events;
            await new Promise(resolve => setTimeout(resolve, 3000));
            router.push(`/nft/${contractSelected}@${createEvents[createEvents.length - 1].args.tokenId.toString()}/list`);
            setIsLoading(false);
        } catch (e) {
            console.log(e)
        }
    }

    const loadCollections = async () => {
        let listCollections = await contract.getCollectionsByOwner(account);
        setCollections(listCollections);
    }

    useEffect(() => {
        if (loaded) {
            loadCollections();
        } else {
            dispatch(loadContract());
        }
    }, [loaded])

    useEffect(() => {
        if (!profile.data.loaded) {
            dispatch(getProfile())
        }
    }, [profile, account]);

    if (!loaded) return <Skeleton h={'80vh'} />
    if (!account) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>CREATE NEW NFT</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                {(collections.length > 0) ? <NFTForm
                    isLoading={isLoading}
                    collections={collections}
                    initialValues={initialValues}
                    onSubmit={createNFT}
                    image={image}
                    setImage={setImage}
                    bg={bg}
                    setBg={setBg}
                    setEditImage={setEditImage}
                    attributes={attributes}
                    setAttributes={setAttributes}
                /> : <Box bg="white" p={6} borderRadius={10} h={'full'}>
                    <Text>Please create your own collection to mint new NFT</Text>
                </Box>}
            </GridItem>
            <GridItem>
                <NFTCard
                    id=""
                    name="New NFT"
                    creator={profile.data.name}
                    creatorAddress={account}
                    image={image}
                    bg={bg}
                    editImage={editImage}
                    tokenInfo={tokens.loaded ? tokens.obj[noneAddress] : {}}
                />
            </GridItem>
        </Grid>
    );
}