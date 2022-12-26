import connectDB from 'src/middleware/mongodb';
import Artist from "src/models/Artist";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let artist = await Artist.findOne({
                address: req.query.address
            });
            if (artist) {
                return res.status(200).send(artist);
            } else {
                return res.status(400).send({});

            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);