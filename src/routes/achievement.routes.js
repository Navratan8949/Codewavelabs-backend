const { Router } = require("express");
const {
  getPublicStats,
  listStats,
  createStats,
  updateStats,
  deleteStats,
} = require("../controller/ourachievements.controller.js");

const router = Router();

// Public endpoint consumed by the UI
router.get("/", getPublicStats);

// Admin endpoints (protect with auth middleware later)
router.get("/all", listStats);
router.post("/", createStats);
router.patch("/:id", updateStats);
router.delete("/:id", deleteStats);

module.exports = router;
