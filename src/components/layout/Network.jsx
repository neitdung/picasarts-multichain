import {
    Button,
    Text,
    MenuList,
    MenuItem,
    MenuDivider,
    Menu,
    MenuButton,
    Image,
    Stack
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import connectToWallet from "src/state/chain/thunks/connectWallet";
import { config, chainInfos } from 'src/state/chain/config';
import { useRouter } from "next/router";
import WalletIcon from 'src/components/icons/Wallet';
import { disconnectNetwork, setIsConnecting, handleEthereumAccountChange } from 'src/state/chain/slice';
import NavItem from './NavItem';
import loadContract from 'src/state/hub/thunks/loadContract';

const USER_ITEMS = [
    {
        label: 'Profile',
        href: '/user/profile',
    },
    {
        label: 'My Collectibles',
        href: '/user/collectibles',
    }
];

export default function Network() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isConnecting, selectedChain, account } = useSelector(state => state.chain);

    const handleConnectNetwork = useCallback(async (chain) => {
        dispatch(setIsConnecting(true));

        await dispatch(connectToWallet(chain));

        dispatch(setIsConnecting(false));
    }, [router])


    const handleDisconnectNetwork = useCallback(async () => {
        // handle disconnect here
        dispatch(setIsConnecting(true));
        dispatch(disconnectNetwork())
        dispatch(setIsConnecting(false));
    }, [selectedChain])


    const handleCheckChain = useCallback(async () => {
        //@ts-ignore
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== config[selectedChain].chainId) {
            dispatch(setIsConnecting(true));
            await dispatch(connectToWallet(selectedChain));
            dispatch(setIsConnecting(false));
        }
    }, [selectedChain]);

    useEffect(() => {
        if (selectedChain && window.ethereum) {
            handleCheckChain();
        }
    }, []);

    useEffect(() => {
        // Check metamask account is disconnected
        if (window.ethereum) {
            //@ts-ignore
            window.ethereum.on('accountsChanged', (accounts) => {
                dispatch(handleEthereumAccountChange(accounts[0]));
            });
            //@ts-ignore
            window.ethereum.on('chainChanged', (chainId) => {
                let realChainId = parseInt(chainId, 16);
                console.log(realChainId)
                // todo handle chain changed
            });
        }
    }, []);

    return (
        <Menu>
            <MenuButton
                as={Button}
                leftIcon={selectedChain ? <Image bgColor={'white'} borderRadius={'20px'} p={1} src={chainInfos[selectedChain].logo} w={'25px'} h={'25px'} /> : <WalletIcon />}
                variant='solid'
                fontSize={'sm'}
                fontWeight={700}
                color={'white'}
                bgGradient='linear(to-r, #f5505e, #ef1399)'
                isLoading={isConnecting}
            >
                {
                    selectedChain ? <Text>
                        {account ? account.slice(0, 7).concat("...").concat(account.slice(account.length - 7, account.length)) : ""}
                    </Text>
                        : <Text>
                            <span>Connect wallet</span>
                        </Text>
                }
            </MenuButton>
            <MenuList zIndex={100}>
                <Stack px={3}>
                    {account && USER_ITEMS.map(child => (
                        <NavItem key={child.label} {...child} />
                    ))}
                </Stack>
                <MenuDivider />
                {Object.keys(chainInfos).map(key => (
                    <MenuItem
                        as={Button}
                        isDisabled={chainInfos[key].disabled}
                        leftIcon={<Image src={chainInfos[key].logo} w={'20px'} h={'20px'} />}
                        variant='ghost'
                        key={`network-${key}`}
                        onClick={() => handleConnectNetwork(key)}
                        sx={{fontWeight: 500, justifyContent: 'start', px: 4}}
                    >
                        {chainInfos[key].label}
                    </MenuItem>
                ))}
                <MenuDivider />
                <MenuItem
                    as={Button}
                    variant='ghost'
                    onClick={() => handleDisconnectNetwork()}
                >
                    Disconnect
                </MenuItem>
            </MenuList>
        </Menu>
    )
}