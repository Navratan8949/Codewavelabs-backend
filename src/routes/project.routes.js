const { Router } = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controller/project.controller.js");
const upload = require("../middleware/multer.middleware.js");

const router = Router();

router.post(
  "/",
  upload.fields([{ name: "images", maxCount: 10 }]),
  createProject
); // Create
router.get("/", getProjects); // Read list  (/api/projects?q=...&category=...&tags=a,b)
router.get("/:id", getProjectById); // Read one
router.put(
  "/:id",
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateProject
); // Update
router.delete("/:id", deleteProject); // Delete

module.exports = router;
