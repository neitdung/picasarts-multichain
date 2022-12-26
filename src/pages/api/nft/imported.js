import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let { address } = req.query;
        let nfts = await Nft.find({ contract_address: address }, 'token_id');
        let result = nfts.map(item => item.token_id);
        return res.status(200).send(result);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);