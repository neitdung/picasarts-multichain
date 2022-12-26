import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';
import PNFT from 'src/abis/PNFT';
import Web3 from 'web3';

const handler = async (req, res) => {
    try {
        if (req.method === 'POST') {
            const { contract_address, list } = req.body;
            const web3 = new Web3(process.env.currentProvider);
            const nftContract = new web3.eth.Contract(
                PNFT.abi,
                contract_address
            );
            for (let i = 0; i < list.length; i++) {
                saveNft(nftContract, list[i]);
            }
            return res.status(200).send({ error: false });
        } else {
            return res.status(422).send({ error: true });
        }
    } catch (e) {
        console.log(e)
        return res.status(422).send({ error: true, ...e });
    }
};

async function saveNft(contract, item) {
    const metadataURI = await contract.tokenURI(parseInt(item)).call();
    const ipfsEndpoint = metadataURI.replace("ipfs://", "http://127.0.0.1:8080/ipfs/");
    const ipnft = metadataURI.replace("ipfs://", "").replace("/metadata.json", "");
    const metadata = await fetch(ipfsEndpoint, { headers: { "content-type": "application/json" } });
    const metaRes = await metadata.json();
    let nft = new Nft({ ...metaRes, token_id: item, ipnft: ipnft });
    await nft.save();
}

export default connectDB(handler);