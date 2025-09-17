const { Router } = require("express");

const {
  submitContact,
  listContacts,
  listById,
  bulkUpdateStatus,
  deleteContact,
  updateSingleStatus,
  ContactById,
} = require("../controller/contact.controller.js");

const router = Router();

router.post("/", submitContact); // public endpoint for your form
router.get("/", listContacts); // protect with auth later (admin inbox)
router.get("/:id", listById);
router.get("/contact/:contactId", ContactById);
router.put("/bulk-status", bulkUpdateStatus);
router.put("/:contactId", updateSingleStatus);
router.delete("/:contactId", deleteContact);

module.exports = router;
