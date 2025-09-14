const { Router } = require("express");

const {
  listLogos,
  createLogo,
  updateLogo,
  deleteLogo,
  getlogoById,
} = require("../controller/brands.controller.js");

const upload = require("../middleware/multer.middleware.js");

const router = Router();

router.get("/", listLogos);
router.get("/:id", getlogoById);
router.post("/", upload.single("logo"), createLogo);
router.patch("/:id", upload.single("logo"), updateLogo);
router.delete("/:id", deleteLogo);

module.exports = router;
