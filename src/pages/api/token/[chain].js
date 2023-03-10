import connectDB from 'src/middleware/mongodb';
import Token from "src/models/Token";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let tokens = await Token.find({
                chain: req.query.chain
            })
            return res.status(200).send({ error: false, result: tokens });
        } catch (error) {
            return res.status(500).send({ error: true, result: error.message });
        }
    } else {
        return res.status(500).send({ error: true, result: 'req_method_not_supported' });
    }
};

export default connectDB(handler);