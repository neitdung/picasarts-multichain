import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { loanAddress, config } from "src/state/chain/config";
import NFTLoan from "src/abis/NFTLoan.json";

const loadContract = createAsyncThunk("loan/contract", async (_payload, { getState }) => {
    let state = await getState();
    if (state.chain.account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(loanAddress, NFTLoan.abi, signer);
        return { contract: contract, isSigner: true }
    } else if (state.chain.selectedChain) {
        const provider = new ethers.providers.WebSocketProvider(config[selectedChain].wssAddress);
        const contract = new ethers.Contract(loanAddress, NFTLoan.abi, provider);
        return { contract: contract, isSigner: false }
    } else {
        const provider = new ethers.providers.WebSocketProvider(config.calamus.wssAddress);
        const contract = new ethers.Contract(loanAddress, NFTLoan.abi, provider);
        return { contract: contract, isSigner: false }
    }
})
export default loadContract;