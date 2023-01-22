import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import PNFT from 'src/abis/PNFT.json';

const getUserCollection = createAsyncThunk("profile/collection", async (payload = null, { getState }) => {
    let state = await getState();
    let collections = state.hub.collections;
    let selectedChain = state.chain.selectedChain;
    let account = state.chain.account;
    if (account && selectedChain && collections.length) {
        let promises = [];
        const provider = new ethers.providers.WebSocketProvider(config[selectedChain].wssAddress);
        for (let i = 0; i < collections.length; i++) {
            const nftContract = new ethers.Contract(collections[i].contractAddress, PNFT.abi, provider);
            promises.push(nftContract.balanceOf(account));
        }

        let values = await Promise.all(promises);
        let result = [];
        for (let i = 0; i < collections.length; i++) {
            if (!values[i].isZero()) {
                result.push(collections[i].contractAddress)
            }
        }
        return result;
    }

    return [];
})

export default getUserCollection;