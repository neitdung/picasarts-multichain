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

        let resJson = await res.json();
        if (resJson.error) {
            return { error: true }
        }
        return { error: false, data: resJson.data };
    } catch (e) {
        console.log(e.message)
        return { error: true }
    }
})

export default getProfile;