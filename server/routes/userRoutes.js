import express from "express";
import { 
    getUserProfile, 
    getAllUsers, 
    updateUserProfile 
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// 1. get users
router.get("/", protect, getAllUsers);

// 2. get profile
router.get("/profile", protect, getUserProfile);

// 3. put profile
router.put("/profile", protect, updateUserProfile);

export default router;