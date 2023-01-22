import { createSlice } from "@reduxjs/toolkit";
import checkArtist from "./thunks/checkArtist";
import getProfile from "./thunks/getProfile";

const initialState = {
    isConnecting: false,
    data: {
        name: "",
        avatar: "",
        banner: "",
        bio: "",
        email: "",
        facebook: "",
        twitter: "",
        instagram: "",
        website: "",
        isRegistered: false,
        loaded: false,
    },
    isArtist: 0,
    listCollections: []
}

export const slice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        setIsConnecting: (state, action) => {
            state.isConnecting = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.data.loaded = true;
            if (!action.payload.error) {
                state.data = { loaded: true, isRegistered: true, ...action.payload.data }
            }
        })
        builder.addCase(checkArtist.fulfilled, (state, action) => {
            state.isArtist = action.payload;
        })
    }
})

export const {
    select,
    setIsConnecting,
} = slice.actions;
export default slice.reducer;