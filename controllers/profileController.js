import Profile from "../models/Profile.js";

// Create or update profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    // ✅ use fixed userId for now
    const userId = req.user?.id || "user123";

    const profileData = {
      ...req.body,
      userId,
    };

    const profile = await Profile.findOneAndUpdate(
      { userId },
      profileData,
      { returnDocument: "after", upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get my profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id || "user123";

    const profile = await Profile.findOne({ userId });
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const userId = req.user?.id || "user123";

    const profiles = await Profile.find({
      userId: { $ne: userId },
    });

    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};