const { Router } = require("express");

const {
  submitContact,
  listContacts,
} = require("../controller/contact.controller.js");

const router = Router();

router.post("/", submitContact); // public endpoint for your form
router.get("/", listContacts); // protect with auth later (admin inbox)

module.exports = router;
