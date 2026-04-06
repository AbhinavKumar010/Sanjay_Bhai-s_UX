import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,   // ✅ THIS IS THE FIX
    required: true,
    unique: true,
  },
  name: String,
  age: Number,
  bio: String,
  gender: String,
  interests: [String],
  profilePic: String,
});

export default mongoose.model("Profile", profileSchema);