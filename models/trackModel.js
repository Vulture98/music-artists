import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const trackSchema = new mongoose.Schema({
    track_id: { type: String, required: true, unique: true, default: uuidv4 },
    artist_id: { type: String, required: true, ref: 'Artist' },
    album_id: { type: String, required: true, ref: 'Album' },
    name: { type: String, required: true, trim: true, lowercase: true },
    duration: { type: Number, required: true },
    hidden: { type: Boolean, default: false },
}, { timestamps: true });


const Track = mongoose.model('Track', trackSchema);
export default Track;