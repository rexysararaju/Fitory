import express from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  deleteTemplate
} from "../controllers/workoutTemplateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTemplate);       // create template
router.get("/", protect, getTemplates);          // get all templates
router.get("/:id", protect, getTemplateById);    // get one template
router.delete("/:id", protect, deleteTemplate);  // delete template

export default router;
