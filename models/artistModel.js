import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const artistSchema = new mongoose.Schema({
  artist_id: { type: String, unique: true, default: uuidv4, required: true }, // Automatically generate UUID
  name: { type: String, required: true, trim: true, lowercase: true },
  grammy: { type: Number, default: 0 }, // Grammy award status
  hidden: { type: Boolean, default: false }, // Visibility toggle
}, { timestamps: true });


const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
