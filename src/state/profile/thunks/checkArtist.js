import { createAsyncThunk } from "@reduxjs/toolkit";

const checkArtist = createAsyncThunk("profile/check-artist", async (payload = null, { getState }) => {
    let state = await getState();
    let {account, selectedChain} = state.chain;
    if (account && selectedChain) {
        let checkRequest = await fetch(`/api/artist/${selectedChain}?address=${account}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
        let checkRes = await checkRequest.json();
        return checkRes.result.approved ? 2 : 1;
    }

    return 0;
})

export default checkArtist;