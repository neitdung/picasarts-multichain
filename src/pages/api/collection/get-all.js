import Collection from 'src/models/Collection';
import connectDB from 'src/middleware/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let chain = req.query.chain ? req.query.chain : 'calamus';
        let docs = await Collection.find({chain: chain});
        return res.status(200).send({ data: docs, error: false});
    } else {
        return res.status(422).send({ error: true, message: 'req_method_not_supported'});
    }
};

export default connectDB(handler);