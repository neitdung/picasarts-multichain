import { createAsyncThunk } from "@reduxjs/toolkit";
import { config } from "../config";

const loadTokens = createAsyncThunk("token/load", async (_payload, { getState }) => {
    const state = await getState();
    const selectedChain = state.chain.selectedChain;
    if (!selectedChain) {
        return { error: true, message: 'not_selected_chain' };
    }
    try {
        let convertedTokens = [config[selectedChain].nativeToken];

        let tokens = await fetch(`/api/token/${selectedChain}`);
        let tokenJson = await tokens.json();
        if (tokenJson.error) {
            return { error: true, message: tokenJson.message };
        }
        convertedTokens = convertedTokens.concat(tokenJson.result);
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