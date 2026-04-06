import express from "express";
import {
  createOrUpdateProfile,
  getAllProfiles,
  getProfileById,
  updateAvailability
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createOrUpdateProfile); // create or update
router.get("/", getAllProfiles);         // get all profiles
router.get("/:id", getProfileById);      // get profile by id
router.patch("/availability", updateAvailability); // update consent/availability

export default router;