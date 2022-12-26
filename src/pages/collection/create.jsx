import React, { useContext, useState } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    useToast
} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { appStore, uploadBtfs, uploadMetadata } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';
import CollectionCard from 'src/components/collection/Card';
import CollectionForm from 'src/components/collection/Form';
import { hasArtistRole } from 'src/state/collection';
import { ethers } from 'ethers';
import { hubAddress } from 'src/config/contractAddress';

export default function CollectionCreate() {
    const { state, dispatch } = useContext(appStore);
    const { mounted, wallet: { connected, signer }, collectionContract } = state;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [editLogo, setEditLogo] = useState(false);
    const [editBanner, setEditBanner] = useState(false);

    const initialValues = {
        name: '',
        symbol: '',
        logo: '',
        description: '',
        banner: '',
        facebook: '',
        instagram: '',
        twitter: '',
        website: ''
    }

    const toast = useToast();

    const createCollection = async (values) => {
        setIsLoading(true);
        const isArtist = await dispatch(hasArtistRole(signer._address));
        if (isArtist) {
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
            if (collectionContract.loaded) {
                const fee = await collectionContract.web3Obj.methods.getCreateFee().call();
                const transactionParameters = [
                    {
                        from: signer._address,
                        to: hubAddress,
                        value: fee,
                        data: collectionContract.web3Obj.methods.createCollection(
                            values.name,
                            values.symbol,
                            metaHash
                        ).encodeABI()
                    }];
                // popup - request the user to sign and broadcast the transaction
                // @ts-ignore
                await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: transactionParameters,
                });
                let emitter = collectionContract.web3Obj.events.CollectionCreated(() => { }).on('data', async (event) => {
                    console.group('New event received');
                    console.log('- Event Name:', event.event);
                    console.log('- Transaction:', event.transactionHash);
                    console.log('- Block number:', event.blockNumber);
                    console.groupEnd();
                    toast({
                        title: "Create collection success",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    setIsLoading(false);
                    router.push(`/collection/edit/${event.returnValues.cid}`);
                    emitter.removeAllListeners('data');
                }).on("error", (error, receipt) => {
                    toast({
                        title: "Create failed",
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                })
            } else {
                toast({
                    title: "Create failed",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Please register as artist on profile/settings page",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    }

    if (!mounted) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>CREATE NEW COLLECTION</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                <CollectionForm
                    // isLoading={isLoading}
                    values={initialValues}
                    onSubmit={createCollection}
                    logo={logo}
                    banner={banner}
                    setEditBanner={setEditBanner}
                    setEditLogo={setEditLogo}
                    setLogo={setLogo}
                    setBanner={setBanner}
                    isUploaded={false}
                />
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