import connectDB from 'src/middleware/mongodb';
import ArtistRequest from "src/models/Artist";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let artists = await ArtistRequest.find({
                chain: req.query.chain
            }).populate('user');
            return res.status(200).send({error: false, result: artists});

        } catch (error) {
            return res.status(500).send({ error: false, result: error.message });
        }
    } else {
        return res.status(500).send({ error: false, result: 'req_method_not_supported' });
    }
};

export default connectDB(handler);