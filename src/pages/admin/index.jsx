import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    TabList,
    Tabs,
    Tab,
    TabPanels,
    TabPanel,
    useToast,
} from '@chakra-ui/react';
import {
    useRouter
} from "next/router";
import { useDispatch, useSelector } from "react-redux";
import loadContract from "src/state/hub/thunks/loadContract";
import BoxLoading from "src/components/common/BoxLoading";
import BaseFee from "src/components/admin/BaseFee";

export default function Admin() {
    const dispatch = useDispatch();
    const { contract, loaded } = useSelector(state => state.hub);
    const { account } = useSelector(state => state.chain);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const loadAdmin = useCallback(async () => {
        let adminRole = await contract.DEFAULT_ADMIN_ROLE();
        let isAdmin = await contract.hasRole(adminRole, account);

        if (isAdmin) {
            setIsLoading(false);
        } else {
            router.push("/");
            toast({
                title: 'You are not the admin',
                description: "Please switch to the admin account.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [account, contract]);

    useEffect(() => {
        if (loaded) {
            loadAdmin();
        } else {
            dispatch(loadContract());
        }
    }, [loaded])

    if (isLoading) return <BoxLoading />;

    return (
        <Box w='full' bg='gray.200' p={20}>
            <Box px={{ base: 4, md: 20 }} py={{ base: 2, md: 10 }} borderRadius='12px' bgColor='white' my={4}>
                <Tabs isFitted variant={'enclosed'} borderWidth={2} borderRadius='12px'>
                    <TabList>
                        <Tab>General</Tab>
                        <Tab>Artists</Tab>
                        <Tab>Whitelist Addresses</Tab>
                        <Tab>Payment Tokens</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <BaseFee />
                        </TabPanel>
                        <TabPanel>
                            Artists
                        </TabPanel>
                        <TabPanel>
                            Whitelist Addresses
                        </TabPanel>
                        <TabPanel>
                            Payment Tokens
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
}