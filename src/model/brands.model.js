const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema(
  {
    logoUrl: { url: String, public_id: String }, // e.g., "/ejuuz.png" ya CDN URL
    order: { type: Number, default: 0 }, // marquee order
    active: { type: Boolean, default: true }, // show/hide
  },
  { timestamps: true }
);

// sorted, active queries fast hon - optional index
logoSchema.index({ active: 1, order: 1 });

const Logo = mongoose.model("Logo", logoSchema);
module.exports = { Logo };
