import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        // Check if name, address is provided
        const { name, address, avatar, banner, bio, email, twitter, instagram, website, facebook } = req.body;
        if (address && name) {
            try {
                let user = new User({
                    name, address, avatar, banner, bio, email, twitter, instagram, website, facebook
                });
                let createdUser = await user.save();
                return res.status(200).send(createdUser);
            } catch (error) {
                return res.status(500).send(error);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);