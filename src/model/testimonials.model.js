const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true }, // "They shipped fast..."
    name: { type: String, required: true, trim: true }, // "VP Product"
    company: { type: String, default: "", trim: true }, // "Fintech Co."
    avatar: { url: String, public_id: String }, // "/brands/fintech-avatar.png"
    order: { type: Number, default: 0 }, // display order
    active: { type: Boolean, default: true }, // toggle visibility
  },
  { timestamps: true }
);

testimonialSchema.index({ active: 1, order: 1 }); // fast ordered listing
testimonialSchema.index({ quote: "text", company: "text" }); // optional text search

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = { Testimonial };
