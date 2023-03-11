import { createSlice } from "@reduxjs/toolkit";
import { noneAddress } from "./config";
import connectToWallet from "./thunks/connectWallet";

import loadTokens from "./thunks/loadTokens";
const initialState = {
    isConnecting: false,
    selectedChain: "",
    availableChains: ["ftm", "avax", "bttc"],
    tokens: {
        loaded: false,
        list: [
            {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
                logo: "/eth.png",
                address: noneAddress
            }
        ],
        obj: {
            "0x0000000000000000000000000000000000000000": {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
                logo: "/eth.png",
                address: noneAddress
            }
        }
    },
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
        builder.addCase(loadTokens.fulfilled, (state, action) => {
            state.tokens.loaded = true;
            if (action.payload.error) {
                state.tokens.list = [];
                state.tokens.obj = {};
                console.log("Load tokens error: ", action.payload.message)
            } else {
                state.tokens.list = action.payload.list;
                state.tokens.obj = action.payload.obj;
            }
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