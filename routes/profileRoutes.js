import express from "express";
import multer from "multer";
import {
  createOrUpdateProfile,
  getAllProfiles,
  getProfileById,
  updateAvailability
} from "../controllers/profileController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Use upload.single("profilePic") to handle the file
router.post("/", upload.single("profilePic"), createOrUpdateProfile);

router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.patch("/availability", updateAvailability);

export default router;