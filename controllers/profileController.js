import Profile from "../models/Profile.js";

// Create or update profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    // Fixed userId for now (replace with auth later)
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const profileData = {
      ...req.body,
      userId,
    };

    // Upsert: create new if not exists
    const profile = await Profile.findOneAndUpdate(
      { userId },
      profileData,
      { returnDocument: "after", upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Optional: toggle availability or consent flags
export const updateAvailability = async (req, res) => {
  try {
    const { userId, isAvailable, canChat, canAudioCall, canVideoCall } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { isAvailable, canChat, canAudioCall, canVideoCall },
      { returnDocument: "after" }
    );

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};