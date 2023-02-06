import { createAsyncThunk } from "@reduxjs/toolkit";
import { marketAddress } from "../config";
import { config } from "../config";
import { ethers } from "ethers";
import Marketplace from 'src/abis/Marketplace.json';
import FungibleToken from 'src/abis/FungibleToken.json'

const loadTokens = createAsyncThunk("token/load", async (_payload, { getState }) => {
    const state = await getState();
    const selectedChain = state.chain.selectedChain;
    if (!selectedChain) {
        return { error: true, message: 'not_selected_chain' };
    }
    try {
        const provider = new ethers.providers.JsonRpcProvider(config[selectedChain].rpcAddress);
        const contract = new ethers.Contract(marketAddress, Marketplace.abi, provider);
        let tokens = await contract.getAcceptTokens();
        let convertedTokens = [config[selectedChain].nativeToken];
        let namePromises = [];
        let symbolPromises = [];
        let decimalPromises = [];

        for (let i = 0; i < tokens.length; i++) {
            let tokenContract = new ethers.Contract(tokens[i], FungibleToken.abi, provider);
            namePromises.push(tokenContract.name());
            symbolPromises.push(tokenContract.symbol());
            decimalPromises.push(tokenContract.decimals());
        }
        let nameTokens = await Promise.all(namePromises);
        let symbolTokens = await Promise.all(symbolPromises);
        let decimalTokens = await Promise.all(decimalPromises);
        for (let i = 0; i < tokens.length; i++) {
            convertedTokens.push({
                address: tokens[i],
                name: nameTokens[i],
                symbol: symbolTokens[i],
                logo: `/${symbolTokens[i].toLowerCase()}.png`,
                decimals: decimalTokens[i]
            })
        }
        let tokenObj = {};
        convertedTokens.forEach(token => {
            tokenObj[token.address] = token;
        });
        return { error: false, list: convertedTokens, obj: tokenObj };
    } catch (e) {
        return { error: true, message: e.message };
    }
})

export default loadTokens;