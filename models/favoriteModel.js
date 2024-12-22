import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const favoriteSchema = new mongoose.Schema({
  favorite_id: { type: String, required: true, unique: true, default: uuidv4 },
  user_id: { type: String, required: true, ref: 'User' },
  category: { type: String, required: true, enum: ['artist', 'album', 'track'], trim: true, lowercase: true },
  item_id: { type: String, required: true },
  name: { type: String, required: true, trim: true, lowercase: true }
}, { timestamps: true });

// Compound index to prevent duplicate favorites
favoriteSchema.index({ user_id: 1, category: 1, item_id: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
