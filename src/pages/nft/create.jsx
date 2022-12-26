import React, { useContext, useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    Box,
    useToast
} from "@chakra-ui/react";
import {  addInteractCollection, appStore, createNftContractWithSigner } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';
import NFTCard from 'src/components/nft/Card';
import NFTForm from 'src/components/nft/Form';
import { addressNone } from 'src/config/contractAddress';

export default function NFTCreate() {
    const { state } = useContext(appStore);
    const { mounted, wallet: { connected, signer, info }, collectionContract, tokenObj } = state;
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
        const metadata = await saveNFTToIpfs(contractSelected, values);
        await saveNFTToContract(contractSelected, metadata, values);
    }

    const saveNFTToIpfs = async (contractSelected, values) => {
        const nftForm = new FormData();
        nftForm.append('contract_address', contractSelected);
        nftForm.append('name', values.name);
        nftForm.append('description', values.description);
        nftForm.append('external_url', values.external_url);
        nftForm.append('royalty', values.royalty);
        nftForm.append('background_color', bg);
        nftForm.append('creator_name', info.name);
        nftForm.append('creator_address', signer._address);
        nftForm.append('media', image);
        nftForm.append('attributes', JSON.stringify(values.attributes));
        const options = {
            method: 'POST',
            body: nftForm
        };
        let result = await fetch("/api/nft/metadata", options);
        let resultJson = await result.json();
        return resultJson;
    }

    const saveNFTToContract = async (contractSelected, metadata, values) => {
        try {
            const nftContract = createNftContractWithSigner(contractSelected);
            await nftContract.safeMint(
                signer._address,
                metadata.url,
                parseInt(values.royalty * 100)
            );

            nftContract.once("Transfer", async (from, to, tokenId, event) => {
                await saveNFTToDB(contractSelected, tokenId.toString(), values, metadata);
                setIsLoading(false);
                toast({
                    title: "Create success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                nftContract.removeAllListeners("Transfer");
            })
        } catch (e) {
            console.log(e)
        }
    }

    const saveNFTToDB = async (contractSelected, tokenId, values, metadata) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        let metaFetch = await fetch(`http://127.0.0.1:8080/ipfs/${metadata.ipnft}/metadata.json`);
        const { image } = await metaFetch.json();
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: values.name,
                description: values.description,
                background_color: bg,
                external_url: values.external_url,
                royalty: parseInt(values.royalty * 100),
                attributes: values.attributes,
                token_id: tokenId,
                creator_address: signer._address,
                creator_name: info.name,
                contract_address: contractSelected,
                ipnft: metadata.ipnft,
                image: image
            })
        };
        await addInteractCollection(signer._address, contractSelected, info.interact_collections);
        let result = await fetch("/api/nft/create", options);
        let resultJson = await result.json();
        console.log(resultJson);
    }

    const loadCollections = async () => {
        let listCollections = await collectionContract.obj.getCollectionsByOwner(signer._address);
        setCollections(listCollections);
    }

    useEffect(() => {
        if (mounted && collectionContract.loaded && signer._address) {
            loadCollections();
        }
    }, [mounted, collectionContract, signer._address])
    if (!mounted) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />

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
                    creator={info.name}
                    creatorAddress={signer._address}
                    image={image}
                    bg={bg}
                    editImage={editImage}
                    tokenInfo={tokenObj[addressNone]} 
                />
            </GridItem>
        </Grid>
    );
}