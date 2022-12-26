import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let nft = new Nft(req.body);
        let createdNft = await nft.save();
        return res.status(200).send(createdNft);
    } else {
        return res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);