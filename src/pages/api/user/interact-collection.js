import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            let user = await User.findOne({ address: req.body.address });
            if (!user.interact_collections.includes(req.body.collection_address)) {
                user.interact_collections.push(req.body.collection_address);
                await user.save();
            }
            return res.status(200).send({error:false});
        } catch (e) {
            return res.status(500).send({ error: true });
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);