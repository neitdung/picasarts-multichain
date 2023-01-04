import Web3 from "web3";
import { config } from "../config";
import { setIsInstalledMetamask } from "../slice";
import detectEthereumProvider from '@metamask/detect-provider';

const getNetworkId = async () => {
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    return currentChainId
}

const addChainToMetamask = async (chain) => {
    try {
        let chainSettings = config[chain];
        // @ts-ignore
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: Web3.utils.toHex(chainSettings.chainId),
                    chainName: chainSettings.name,
                    rpcUrls: [chainSettings.rpcAddress] /* ... */,
                    nativeCurrency: chainSettings.nativeCurrency,
                    blockExplorerUrls: [chainSettings.blockchainExplorer]
                },
            ],
        });
        return true;
    } catch (e) {
        console.error("Could not add or reject to connect", e)
        return false;
    }
}

const switchNetwork = async (chain) => {
    const currentChainId = await getNetworkId()
    let chainId = config[chain].chainId;
    if (currentChainId !== chainId) {
        try {
            // @ts-ignore
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(chainId) }],
            });
            return true;
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                let addResult = await addChainToMetamask(chain);
                return addResult;
            }
            return false;
        }
    }
    return true;
}

export const checkMetaMask = async (chain) => {
    const provider = await detectEthereumProvider();
    if (provider) {
        // await window.ethereum.request({ method: 'eth_accounts' });
        let switchResult = await switchNetwork(chain);
        return switchResult;
    } else {
        console.log(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        const { store } = require("src/state/store");
        store.dispatch(setIsInstalledMetamask(false))
        return false;
    }
}

export const connectMetamask = async () => {
    try {
        await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        return true;
    } catch (e) {
        console.log("Error happened:", e);
        return false;
    }
}