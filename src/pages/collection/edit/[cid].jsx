import React, { useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    useToast
} from "@chakra-ui/react";
import NotConnected from 'src/components/common/NotConnected';
import CollectionCard from 'src/components/collection/Card';
import CollectionForm from 'src/components/collection/Form';
import { useRouter } from 'next/router';
import { uploadBtfs, uploadMetadata } from 'src/state/util';
import { useDispatch, useSelector } from 'react-redux';
import loadContract from 'src/state/hub/thunks/loadContract';
import checkArtist from 'src/state/profile/thunks/checkArtist';
import { BigNumber } from 'ethers';

export default function CollectionEdit({ cid }) {
    const dispatch = useDispatch();
    const { account } = useSelector(state => state.chain);
    const { signer, contract, loaded } = useSelector(state => state.hub);
    const { isArtist } = useSelector(state => state.profile);

    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({});
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [editLogo, setEditLogo] = useState(false);
    const [editBanner, setEditBanner] = useState(false);

    const loadCollection = async () => {
        setIsFirstLoading(true);
        let cData = await contract.getCollectionData(cid);
        if (cData.name) {
            let cMetadata = await fetch(`http://127.0.0.1:8080/btfs/${cData.metadata}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(cData)
            let cMetadataRes = await cMetadata.json();
            setLogo(cMetadataRes.logo);
            setBanner(cMetadataRes.banner);
            setInitialValues({ ...cData, ...cMetadataRes });
            setIsFirstLoading(false);
        } else {
            // router.push("/");
            setIsFirstLoading(false)
        }
    }

    useEffect(() => {
        if (loaded) {
            dispatch(checkArtist());
            loadCollection();
        } else {
            dispatch(loadContract());
        }
    }, [loaded]);

    const toast = useToast();

    const updateCollection = async (values) => {
        if (isArtist === 2) {
            try {
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
                let updateReq = await signer.editMetaData(BigNumber.from(cid), metaHash);
                await updateReq.wait();
                toast({
                    title: "Edit success",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setIsLoading(false);
            } catch (e) {
                toast({
                    title: "Edit failed",
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

    if (!loaded || isFirstLoading) return <Skeleton h={'80vh'} />
    if (!account) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>EDIT COLLECTION</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                <CollectionForm
                    isArtist={isArtist}
                    isLoading={isLoading}
                    values={initialValues}
                    onSubmit={updateCollection}
                    logo={logo}
                    banner={banner}
                    setEditBanner={setEditBanner}
                    setEditLogo={setEditLogo}
                    setLogo={setLogo}
                    setBanner={setBanner}
                    isUploaded={true}
                />
            </GridItem>
            <GridItem>
                <CollectionCard
                    id={cid}
                    contractAddress={initialValues?.contractAddress}
                    name={initialValues?.name}
                    description={initialValues?.description}
                    logo={logo}
                    banner={banner}
                    editLogo={editLogo}
                    editBanner={editBanner}
                />
            </GridItem>
        </Grid>
    );
}

CollectionEdit.getInitialProps = async ({ query }) => {
    return {
        cid: query.cid
    }
}