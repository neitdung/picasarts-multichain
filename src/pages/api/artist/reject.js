import connectDB from 'src/middleware/mongodb';
import ArtistRequest from "src/models/Artist";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            let doc = await ArtistRequest.findOneAndDelete({
                chain: req.body.chain,
                address: req.body.address.toLowerCase()
            });
            return res.status(200).send({ error: false, result: doc });
        } catch (error) {
            return res.status(500).send({ error: true, result: error.message });
        }
    } else {
        return res.status(500).send({ error: true, result: 'req_method_not_supported' });
    }
};

export default connectDB(handler);