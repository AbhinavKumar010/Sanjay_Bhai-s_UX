import Profile from "../models/Profile.js";
import { v4 as uuidv4 } from "uuid";

// Create profile (no auth yet, unique per user)
export const createProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const userId = req.user?.id || uuidv4(); // unique id if no auth

    const profileData = {
      ...req.body,
      userId,
    };

    const profile = await Profile.create(profileData); // always create new
    res.json(profile);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};