import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { rentalAddress, config } from "src/state/chain/config";
import Rental from "src/abis/Rental.json";

const loadContract = createAsyncThunk("rental/contract", async (_payload, { getState }) => {
    let state = await getState();
    if (state.chain.account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(rentalAddress, Rental.abi, signer);
        return { contract: contract, isSigner: true }
    } else if (state.chain.selectedChain) {
        const provider = new ethers.providers.WebSocketProvider(config[selectedChain].wssAddress);
        const contract = new ethers.Contract(rentalAddress, Rental.abi, provider);
        return { contract: contract, isSigner: false }
    } else {
        const provider = new ethers.providers.WebSocketProvider(config.calamus.wssAddress);
        const contract = new ethers.Contract(rentalAddress, Rental.abi, provider);
        return { contract: contract, isSigner: false }
    }
})
export default loadContract;