import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,   // ✅ unique identifier for user
    required: true,
    unique: true,
  },
  name: String,
  age: Number,
  bio: String,
  gender: String,
  interests: [String],
  profilePic: String,

  // ✅ Consent fields
  canChat: { type: Boolean, default: true },
  canAudioCall: { type: Boolean, default: true },
  canVideoCall: { type: Boolean, default: true },
});

export default mongoose.model("Profile", profileSchema);