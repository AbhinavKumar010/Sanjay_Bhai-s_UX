import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileById,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createOrUpdateProfile);
router.get("/me", getMyProfile);
router.get("/", getAllProfiles);
router.get("/:id", getProfileById);

export default router;