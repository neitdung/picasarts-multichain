import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { config } from "src/state/chain/config";
import Hub from "src/abis/Hub.json";

const loadContract = createAsyncThunk("hub/contract", async (_payload, { getState }) => {
    let state = await getState();
    const hubAddress = config[state.chain.selectedChain].hubAddress;
    if (state.chain.account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(hubAddress, Hub.abi, signer);
        return { contract: contract, isSigner: true }
    } else if (state.chain.selectedChain) {
        const provider = new ethers.providers.JsonRpcProvider(config[selectedChain].rpcAddress);
        const contract = new ethers.Contract(hubAddress, Hub.abi, provider);
        return { contract: contract, isSigner: false }
    } else {
        const provider = new ethers.providers.JsonRpcProvider(config.calamus.rpcAddress);
        const contract = new ethers.Contract(hubAddress, Hub.abi, provider);
        return { contract: contract, isSigner: false }
    }
})
export default loadContract;