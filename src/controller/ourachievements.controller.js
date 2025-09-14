const { Stats } = require("./../model/achievements.model.js");

// Public: GET /api/stats (returns the latest active stats document)
const getPublicStats = async (req, res, next) => {
  try {
    const doc = await Stats.findOne({ active: true }).sort({ updatedAt: -1 });
    return res.json({ data: doc });
  } catch (e) {
    next(e);
  }
};

// Admin: list all
const listStats = async (req, res, next) => {
  try {
    const items = await Stats.find({}).sort({ updatedAt: -1 });
    res.json({ data: items });
  } catch (e) {
    next(e);
  }
};

// Admin: create a new stats snapshot
const createStats = async (req, res, next) => {
  try {
    const doc = await Stats.create(req.body);
    res.status(201).json({ data: doc });
  } catch (e) {
    next(e);
  }
};

// Admin: update by id
const updateStats = async (req, res, next) => {
  try {
    const doc = await Stats.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
};

// Admin: delete by id
const deleteStats = async (req, res, next) => {
  try {
    const doc = await Stats.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getPublicStats,
  listStats,
  createStats,
  updateStats,
  deleteStats,
};

// // POST /api/stats body example
// {
//   "projects": 120,
//   "clients": 60,
//   "years": 6,
//   "support": 24,
//   "active": true,
//   "note": "Updated after Q3 deliveries"
// }
