import { createSlice } from "@reduxjs/toolkit";
import connectToWallet from "./thunks/connectWallet";
import { ethers } from "ethers";
const initialState = {
    isConnecting: false,
    selectedChain: "",
    availableChains: ["calamus", "picasart"],
    account: "",
    web3Loaded: false,
    infoLoaded: false,
    registered: false,
    isInstalledMetamask: false
}

export const slice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        select: (state, action) => {
            state.chain = action.payload;
        },
        setIsConnecting: (state, action) => {
            state.isConnecting = action.payload;
        },
        disconnectNetwork: (state, _action) => {
            state.account = "";
            state.web3Loaded = false;
            state.selectedChain = "";
        },
        setIsInstalledMetamask: (state, action) => {
            state.isInstalledMetamask = action.payload;
        },
        handleEthereumAccountChange: (state, action) => {
            state.account = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(connectToWallet.fulfilled, (state, action) => {
            if (action.payload.account) {
                state.web3Loaded = true;
            } else {
                state.web3Loaded = false;
            }
            state.account = action.payload.account;
            state.selectedChain = action.payload.chain;
        })
    }
})

export const {
    select,
    setIsConnecting,
    setIsInstalledMetamask,
    disconnectNetwork,
    handleEthereumAccountChange
} = slice.actions;
export default slice.reducer;