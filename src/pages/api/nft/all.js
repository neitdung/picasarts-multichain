import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let nfts = await Nft.find({});
        return res.status(200).send(nfts);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);