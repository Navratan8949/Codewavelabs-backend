const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "A. Sharma"
    role: { type: String, required: true, trim: true }, // "Founder & CEO"
    img: { url: String, public_id: String }, // "/team/team1.webp"
    linkedin: { type: String, default: "" }, // "#"
    email: { type: String, default: "" }, // "a.sharma@company.com"
    description: { type: String, default: "" }, // long bio/summary
    expertise: { type: [String], default: [] }, // ["Strategic Planning", ...]
    iconKey: {
      type: String,
      enum: [
        "Award",
        "Lightbulb",
        "Target",
        "Users",
        "Globe",
        "Shield",
        "Code",
      ],
      default: "Users",
    }, // which lucide icon to render
    active: { type: Boolean, default: true }, // show/hide in UI
    order: { type: Number, default: 0 }, // manual sort
  },
  { timestamps: true }
);

// helpful index for sorted, active listing
teamMemberSchema.index({ active: 1, order: 1 });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
module.exports = { TeamMember };
