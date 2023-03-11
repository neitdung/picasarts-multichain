import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkMetaMask, connectMetamask } from "../utils/metamask";

const connectToWallet = createAsyncThunk("wallet/connect", async (chain) => {
    let connectResult = false;
    let account = "";
    let checkResult = await checkMetaMask(chain);
    if (!checkResult) {
        return { chain: "", account: "" };
    }
    connectResult = await connectMetamask();
    const allAccounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (allAccounts && allAccounts.length) {
        console.log('Success!', 'Wallet Connected!', 'success')
        account = allAccounts[0];
    }
    if (connectResult) {
        return { chain: chain, account: account };
    } else {
        return { chain: chain, account: "" };
    }
})

export default connectToWallet;