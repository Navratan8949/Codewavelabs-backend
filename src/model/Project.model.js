// src/models/Project.model.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "Website" },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    projectLink: { type: String, default: "" },

    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    client: { type: String, default: "" },
    duration: { type: String, default: "" },
    year: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.index({
  title: "text",
  description: "text",
  longDescription: "text",
  technologies: "text",
  tags: "text",
});

const Project = mongoose.model("Project", projectSchema);
module.exports = { Project };
