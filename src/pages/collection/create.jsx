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
import NotConnected from 'src/components/common/NotConnected';
import CollectionCard from 'src/components/collection/Card';
import CollectionForm from 'src/components/collection/Form';
import { uploadBtfs, uploadMetadata } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import loadContract from 'src/state/hub/thunks/loadContract';
import checkArtist from 'src/state/profile/thunks/checkArtist';

export default function CollectionCreate() {
    const dispatch = useDispatch();
    const { account } = useSelector(state => state.chain);
    const { signer, contract, loaded } = useSelector(state => state.hub);
    const { isArtist } = useSelector(state => state.profile);

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [editLogo, setEditLogo] = useState(false);
    const [editBanner, setEditBanner] = useState(false);
    // const [listHash, setListHash] = useState([]);
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
    // const uploadHash = async (data) => {
    //     let path = await uploadBtfs(data);
    //     setListHash(current => [...current, path]);
    // }
    // useEffect(() => {
    //     if (logo) {
    //         uploadHash(logo);
    //     }
    // }, [logo])
    // useEffect(() => {
    //     if (listHash) {
    //         console.log("Push new: ",listHash.length);
    //         console.log(listHash);
    //     }
    // }, [listHash])
    const createCollection = async (values) => {
        setIsLoading(true);
        if (isArtist === 2) {
            try {
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
                let fee = await contract.CREATE_FEE();
                let createReq = await signer.createCollection(values.name, values.symbol, metaHash, {value: fee});
                let createRes = await createReq.wait();
                let createEvent = createRes.events.find(item => item.event == "CollectionCreated");
                if (createEvent) {
                    router.push(`/collection/edit/${createEvent.args[0].toString()}`);
                }
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error: " + e.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setIsLoading(false);
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
                    bgClip='text'>CREATE NEW COLLECTION</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                <CollectionForm
                    isArtist={isArtist}
                    isLoading={false}
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