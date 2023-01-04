import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { marketAddress, config } from "src/state/chain/config";
import Marketplace from "src/abis/Marketplace.json";

const loadContract = createAsyncThunk("market/contract", async (_payload, { getState }) => {
    let state = await getState();
    if (state.chain.account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(marketAddress, Marketplace.abi, provider);
        return { contract: contract, isSigner: true }
    } else if (state.chain.selectedChain) {
        const provider = new ethers.providers.Web3Provider(config[selectedChain].wssAddress);
        const contract = new ethers.Contract(marketAddress, Marketplace.abi, provider);
        return { contract: contract, isSigner: false }
    } else {
        const provider = new ethers.providers.Web3Provider(config.calamus.wssAddress);
        const contract = new ethers.Contract(marketAddress, Marketplace.abi, provider);
        return { contract: contract, isSigner: false }
    }
})
export default loadContract;