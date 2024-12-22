import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = mongoose.Schema({
  user_id: { type: String, unique: true, default: uuidv4, required: true }, // Automatically generate UUID
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true, },
  role: {
    type: String, enum: ["admin", "editor", "viewer"], trim: true,
    lowercase: true, default: "viewer",
  },
},
  { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
