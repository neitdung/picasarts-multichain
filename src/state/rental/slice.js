import { createSlice } from "@reduxjs/toolkit";
import loadContract from "./thunks/loadContract";

const initialState = {
    loaded: false,
    contract: null,
    signer: null,
    list: []
}

export const slice = createSlice({
    name: 'rental',
    initialState,
    reducers: {
        select: (state, action) => {
            state.chain = action.payload;
        },
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