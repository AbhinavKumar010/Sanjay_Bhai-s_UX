import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,   // unique identifier per user
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  age: Number,
  bio: String,
  gender: String,
  interests: [String],
  profilePic: String,

  // Consent & availability
  isAvailable: { type: Boolean, default: true },
  canChat: { type: Boolean, default: true },
  canAudioCall: { type: Boolean, default: true },
  canVideoCall: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);