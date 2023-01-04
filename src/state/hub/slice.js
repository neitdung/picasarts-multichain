import { createSlice } from "@reduxjs/toolkit";
import loadContract from "./thunks/loadContract";
const initialState = {
    loaded: false,
    contract: null,
    signer: null,
    acceptedTokens: [],
    collections: [],
}

export const slice = createSlice({
    name: 'hub',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(loadContract.fulfilled, (state, action) => {
            state.contract = action.payload.contract;
            state.loaded = true;
            if (action.payload.isSigner) {
                state.signer = action.payload.contract;
            }
        })
    }
})

export const {
} = slice.actions;
export default slice.reducer;