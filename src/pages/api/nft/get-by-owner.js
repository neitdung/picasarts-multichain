import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let chain = req.query.chain ? req.query.chain : 'calamus';
        if (!req.query.address) {
            return res.status(422).send({ error: true, message: 'missing_address' });
        }
        let docs = await Nft.find({ chain: chain, owner: { '$regex': req.query.address, $options: 'i' } });
        return res.status(200).send({ data: docs, error: false });
    } else {
        return res.status(422).send({ error: true, message: 'req_method_not_supported' });
    }
};

export default connectDB(handler);