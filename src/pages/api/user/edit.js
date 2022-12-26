import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            let user = await User.findOneAndUpdate({ address: req.body.address }, req.body);
            return res.status(200).send(user);
        } catch (e) {
            return res.status(500).send(e);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);