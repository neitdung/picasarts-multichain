import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let chain = req.query.chain ? req.query.chain : 'calamus';

        if (!req.query.ipnft) {
            return res.status(422).send({ error: true, message: 'missing_ipnft' });
        }
        let doc = await Nft.findOne({ chain: chain, ipnft: { '$regex': req.query.ipnft, $options: 'i' } });
        if (doc) {
            return res.status(200).send({ data: doc, error: false });
        }
        return res.status(422).send({ error: true, message: 'not_found' });
    } else {
        return res.status(422).send({ error: true, message: 'req_method_not_supported' });
    }
};

export default connectDB(handler);