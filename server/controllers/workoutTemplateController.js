import WorkoutTemplate from "../models/WorkoutTemplate.js";

// ➕ Create a template (User or Global)
export const createTemplate = async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Template name is required" });
    }

    const template = await WorkoutTemplate.create({
      name,
      exercises: exercises || [],
      user: req.user?.id || null
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📚 Get all templates (global + user templates)
export const getTemplates = async (req, res) => {
  try {
    const templates = await WorkoutTemplate.find({
      $or: [
        { user: null },            // global templates
        { user: req.user.id }      // user templates
      ]
    }).sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get a template by ID
export const getTemplateById = async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete template
export const deleteTemplate = async (req, res) => {
  try {
    const template = await WorkoutTemplate.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id // users can delete only their templates
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
