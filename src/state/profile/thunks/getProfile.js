import { createAsyncThunk } from "@reduxjs/toolkit";

const getProfile = createAsyncThunk("profile/get", async (payload = null, {getState}) => {
    let state = await getState();
    let account = state.chain.account;
    try {
        let res = await fetch(`/api/user/${account}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let user = await res.json();
        return { error: false, data: user };
    } catch (e) {
        console.log(e.message)
        return { error: true }
    }
})

export default getProfile;