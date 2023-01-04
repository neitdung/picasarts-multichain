import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let nft = new Schema({
    contract_address: {
        type: String,
        required: true,
    },
    token_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    external_url: {
        type: String,
    },
    royalty: {
        type: String,
    },
    background_color: {
        type: String,
    },
    creator_name: {
        type: String,
    },
    creator_address: {
        type: String,
    },
    twitter: {
        type: String,
        required: false
    },
    attributes: [{
        display_type: String,
        trait_type: String,
        value: String
    }],
    ipnft: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});
let Nft = mongoose.model('Nft', nft);

export default Nft;