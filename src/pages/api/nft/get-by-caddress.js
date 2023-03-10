import Nft from 'src/models/Nft';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let { address } = req.query;
        if (address) {
            let chain = req.query.chain ? req.query.chain : 'calamus';
            let docs = await Nft.find({ chain: chain, contract_address: address });
            return res.status(200).send({ error: false, data: docs });
        } else {
            return res.status(400).send({ error: true, message: 'missing_args'});
        }
    } else {
        return res.status(400).send({ error: true, message: 'method_not_support' });
    }
};

export default connectDB(handler);