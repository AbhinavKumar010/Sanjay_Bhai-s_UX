import Profile from "../models/Profile.js";

// -------------------- CREATE OR UPDATE PROFILE --------------------
export const createOrUpdateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Replace with proper auth later
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    // Build profile data
    const profileData = {
      ...req.body,
      userId,
    };

    // Handle uploaded file
    if (req.file) {
      profileData.profilePic = `/uploads/${req.file.filename}`;
    }

    // Convert interests string to array if needed
    if (profileData.interests && typeof profileData.interests === "string") {
      profileData.interests = profileData.interests
        .split(",")
        .map((i) => i.trim());
    }

    // Upsert profile
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

// -------------------- GET ALL PROFILES --------------------
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET PROFILE BY ID --------------------
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

// -------------------- UPDATE AVAILABILITY / CONSENT --------------------
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