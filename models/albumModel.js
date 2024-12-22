// models/albumModel.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const albumSchema = mongoose.Schema({
  album_id: {
    type: String,
    unique: true,
    default: uuidv4,
    required: true
  },
  artist_id: {
    type: String,
    required: true,
    ref: 'Artist',  // Reference to Artist model
  },
  name: { type: String, required: true, trim: true, lowercase: true },
  year: { type: Number, required: true },
  hidden: { type: Boolean, default: false }
}, { timestamps: true });

const Album = mongoose.model("Album", albumSchema);

export default Album;









// artist_id: {
//   type: String,
//     // type: mongoose.Schema.Types.ObjectId,
//     // type: mongoose.Schema.Types.UUID,
//     required: true,
//       ref: 'Artist',  // Reference to Artist model
// // validate: {
// //   validator: async function (v) {
// //     const artist = await mongoose.model('Artist').findOne({ artist_id: v });
// //     return artist !== null;
// //   },
// //   message: props => `Artist with ID ${props.value} does not exist`
// // }