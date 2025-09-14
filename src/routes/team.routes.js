const { Router } = require("express");
const {
  listTeam,
  createMember,
  updateMember,
  deleteMember,
  getTeamMemberById,
} = require("../controller/TeamMembers.controller.js");
const upload = require("../middleware/multer.middleware.js");

const router = Router();

router.get("/", listTeam);
router.get("/:id", getTeamMemberById);
router.post("/", upload.single("image"), createMember);
router.patch("/:id", upload.single("image"), updateMember);
router.delete("/:id", deleteMember);

module.exports = router;
