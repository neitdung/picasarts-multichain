import connectDB from 'src/middleware/mongodb';
import { hubAddress } from "src/config/contractAddress";
import Hub from 'src/abis/Hub.json';
import Web3 from 'web3';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const web3 = new Web3(process.env.currentProvider);
        const collectionContract = new web3.eth.Contract(
            Hub.abi,
            hubAddress
        );
        const artistRole = await collectionContract.methods.ARTIST_ROLE().call();
        const tx = collectionContract.methods.grantRole(artistRole, req.body.address);
        const gas = await tx.estimateGas({ from: process.env.metaPK });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(process.env.metaPK) + 1;

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: collectionContract.options.address,
                data,
                gas,
                gasPrice,
                nonce,
                chainId: 1281
            },
            process.env.metaSK
        );

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return res.status(200).send({success: "ok"});
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);