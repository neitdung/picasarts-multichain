import Collection from 'src/models/Collection';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let chain = req.query.chain ? req.query.chain : 'calamus';
        if (!req.query.cid) {
            return res.status(422).send({ error: true, message: 'missing_args' });
        }
        let doc = await Collection.findOne({ chain: chain, cid: req.query.cid });
        if (doc && doc._id) {
            return res.status(200).send({ data: doc, error: false });
        }
        return res.status(404).send({ error: true, message: 'not_found' });
    } else {
        return res.status(422).send({ error: true, message: 'req_method_not_supported' });
    }
};

export default connectDB(handler);