const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true, maxlength: 5000 },
    // status to manage inbox processing if needed
    status: { type: String, enum: ["new", "read", "archived"], default: "new" },
  },
  { timestamps: true }
);

contactMessageSchema.index({ email: 1, createdAt: -1 });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
module.exports = { ContactMessage };
