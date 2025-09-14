const { Router } = require("express");
const {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialById,
} = require("../controller/testimonials.controller.js");
const upload = require("../middleware/multer.middleware.js");

const router = Router();

router.get("/", listTestimonials);
router.post("/", upload.single("avatar"), createTestimonial);
router.get("/:id", getTestimonialById);
router.patch("/:id", upload.single("avatar"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
