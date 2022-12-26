import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let { address, token_id } = req.query;
        let nft = await Nft.findOne({ contract_address: address, token_id: token_id });
        return res.status(200).send(nft);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);