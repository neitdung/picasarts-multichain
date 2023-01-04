import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

let Schema = mongoose.Schema;

let artist = new Schema({
    address: {
        type: String,
        required: true
    },
    chain: {
        type: String,
        required: true,
    },
    user: { type: ObjectId, ref: 'User' }
});
artist.index({ address: 1, chain: 1 }, { unique: true })
let ArtistRequest = mongoose.model('ArtistRequest', artist);

export default ArtistRequest;