import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { hubAddress, config } from "src/state/chain/config";
import Hub from "src/abis/Hub.json";

const loadContract = createAsyncThunk("hub/contract", async (_payload, { getState }) => {
    let state = await getState();
    if (state.chain.account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(hubAddress, Hub.abi, provider);
        return { contract: contract, isSigner: true }
    } else if (state.chain.selectedChain) {
        const provider = new ethers.providers.Web3Provider(config[selectedChain].wssAddress);
        const contract = new ethers.Contract(hubAddress, Hub.abi, provider);
        return { contract: contract, isSigner: false }
    } else {
        const provider = new ethers.providers.Web3Provider(config.calamus.wssAddress);
        const contract = new ethers.Contract(hubAddress, Hub.abi, provider);
        return { contract: contract, isSigner: false }
    }
})
export default loadContract;