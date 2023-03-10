import connectDB from 'src/middleware/mongodb';
import ArtistRequest from 'src/models/Artist';
import User from 'src/models/User';

const handler = async (req, res) => {
    try {
        if (req.method === 'POST') {
            if (req.body.chain && req.body.address) {
                let user = await User.findOne({ address: req.body.address });
                if (user._id) {
                    let newReq = new ArtistRequest({ address: req.body.address.toLowerCase(), chain: req.body.chain, user: user._id });
                    await newReq.save();
                    return res.status(200).send({ error: false });
                } else {
                    return res.status(422).send({ error: true, message: "user_not_registered" });
                }
            } else {
                return res.status(422).send({ error: true, message: "missing_fields" });
            }
        } else {
            return res.status(422).send({error: true, message: "method_not_supported"});
        }
    } catch (e) {
        return res.status(422).send({ error: true, message: e.message });
    }

};

export default connectDB(handler);