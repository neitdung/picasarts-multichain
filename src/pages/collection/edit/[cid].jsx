import React, { useContext, useState, useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Center,
    Skeleton,
    useToast
} from "@chakra-ui/react";

import { appStore } from 'src/state/app';
import NotConnected from 'src/components/common/NotConnected';
import CollectionCard from 'src/components/collection/Card';
import { uploadBtfs, uploadMetadata } from 'src/state/app';
import CollectionForm from 'src/components/collection/Form';
import { useRouter } from 'next/router';

export default function CollectionEdit({ cid }) {
    const { state } = useContext(appStore);
    const { mounted, wallet: { connected }, collectionContract } = state;

    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [logo, setLogo] = useState('');
    const [banner, setBanner] = useState('');
    const [editLogo, setEditLogo] = useState(false);
    const [editBanner, setEditBanner] = useState(false);

    const router = useRouter();

    const loadCollection = async () => {
        setIsLoading(true);
        let cData = await collectionContract.obj.getCollectionData(cid);
        if (cData.name) {
            let cMetadata = await fetch(`http://127.0.0.1:8080/ipfs/${cData.metadata}`);
            let cMetadataRes = await cMetadata.json();
            setLogo(cMetadataRes.logo);
            setBanner(cMetadataRes.banner);
            setInitialValues({ ...cData, ...cMetadataRes });
            setIsLoading(false);
        } else {
            router.push("/");
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (mounted && connected && collectionContract.loaded) {
            loadCollection();
        }
    }, [mounted, connected, collectionContract]);

    const toast = useToast();

    const updateCollection = async (values) => {
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
        if (collectionContract.loaded) {
            try {
                await collectionContract.obj.editMetaData(
                    cid,
                    metaHash
                );
            } catch (e) {
                console.log(e)
            }
        } else {
            toast({
                title: "Edit failed",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }

        toast({
            title: "Edit success",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setIsLoading(false);
    }

    if (!mounted || isLoading) return <Skeleton h={'80vh'} />
    if (!connected) return <NotConnected />

    return (
        <Grid bg="gray.100" p={20} templateColumns='repeat(3, 1fr)' gap={12}>
            <GridItem colSpan={3}>
                <Center><Text fontSize={'3xl'} fontWeight={700} bgGradient='linear(to-l, #f5505e, #ef1399)'
                    bgClip='text'>EDIT COLLECTION</Text></Center>
            </GridItem>
            <GridItem colSpan={2} >
                <CollectionForm
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