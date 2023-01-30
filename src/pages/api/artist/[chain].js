import connectDB from 'src/middleware/mongodb';
import ArtistRequest from "src/models/Artist";
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            if (req.query.address) {
                let artists = await ArtistRequest.findOne({
                    chain: req.query.chain,
                    address: req.query.address
                }).populate('user');
                return res.status(200).send({ error: false, result: artists });
            } else {
                let artists = await ArtistRequest.find({
                    chain: req.query.chain
                }).populate('user');
                return res.status(200).send({ error: false, result: artists });
            }
        } catch (error) {
            return res.status(500).send({ error: true, result: error.message });
        }
    } else {
        return res.status(500).send({ error: true, result: 'req_method_not_supported' });
    }
};

export default connectDB(handler);