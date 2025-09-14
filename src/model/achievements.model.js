const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    // Site-level metrics used by the Achievements component
    projects: { type: Number, default: 0, min: 0 },
    clients: { type: Number, default: 0, min: 0 },
    years: { type: Number, default: 0, min: 0 },
    support: { type: Number, default: 24, min: 0 }, // hours, you show "24/7" in UI

    // Optional display labels/suffixes if needed per metric
    labels: {
      type: new mongoose.Schema(
        {
          projects: { type: String, default: "Projects Delivered" },
          clients: { type: String, default: "Happy Clients" },
          years: { type: String, default: "Years Experience" },
          support: { type: String, default: "Support" },
        },
        { _id: false }
      ),
      default: undefined,
    },
    suffixes: {
      type: new mongoose.Schema(
        {
          projects: { type: String, default: "+" },
          clients: { type: String, default: "+" },
          years: { type: String, default: "+" },
          support: { type: String, default: "/7" },
        },
        { _id: false }
      ),
      default: undefined,
    },

    // Control/metadata
    active: { type: Boolean, default: true }, // public endpoint returns the active stats doc
    note: { type: String, default: "" }, // internal note/changelog
  },
  { timestamps: true }
);

// If you plan to keep one active record, index can help quick reads
statsSchema.index({ active: 1, updatedAt: -1 });

const Stats = mongoose.model("Stats", statsSchema);
module.exports = { Stats };
