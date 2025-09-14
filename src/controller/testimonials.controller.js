const { Testimonial } = require("../model/testimonials.model.js");
const { uploadImageOnCloudinary } = require("../utils/cloudinary.js");

// List active, ordered
const listTestimonials = async (req, res, next) => {
  try {
    const items = await Testimonial.find({ active: true }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json({ data: items });
  } catch (e) {
    next(e);
  }
};

// Create
const createTestimonial = async (req, res, next) => {
  try {
    const { quote, name, company, order, active } = req.body;

    let avatar = null;

    if (req.file) {
      const up = await uploadImageOnCloudinary(req.file.path);
      if (up) {
        avatar = {
          url: up.secure_url || up.url,
          public_id: up.public_id,
        };
      }
    }

    const doc = await Testimonial.create({
      quote,
      name,
      company,
      avatar,
      active: active === "false" ? false : true,
      order,
    });

    console.log("Testimonial created:", doc);
    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    next(e);
  }
};

// Update by id
const updateTestimonial = async (req, res, next) => {
  try {
    const id = req.params.id;
    const current = await Testimonial.findById(id);
    if (!current)
      return res.status(404).json({ error: "Testimonial not found" });

    // Shallow updates from request body
    const b = req.body;
    if (b.quote !== undefined) current.quote = b.quote;
    if (b.name !== undefined) current.name = b.name;
    if (b.company !== undefined) current.company = b.company;
    if (b.order !== undefined) current.order = parseInt(b.order, 10) || 0;
    if (b.active !== undefined)
      current.active = b.active === "true" || b.active === true;

    // Handle avatar upload
    if (req.files?.avatar) {
      // Delete existing avatar if it exists
      if (current.avatar?.public_id) {
        try {
          await deleteImageOnCloudinary(current.avatar.public_id);
        } catch (err) {
          console.error(`Failed to delete old avatar: ${err.message}`);
        }
      }
      // Upload new avatar
      const up = await uploadImageOnCloudinary(req.files.avatar.path);
      if (up) {
        current.avatar = {
          url: up.secure_url || up.url,
          public_id: up.public_id,
        };
      }
    }

    // Handle avatar removal
    if (b.removeAvatarId && current.avatar?.public_id === b.removeAvatarId) {
      try {
        await deleteImageOnCloudinary(current.avatar.public_id);
        current.avatar = null;
      } catch (err) {
        console.error(`Failed to delete avatar: ${err.message}`);
      }
    }

    const saved = await current.save();
    res.json({ data: saved });
  } catch (e) {
    next(e);
  }
};

const getTestimonialById = async (req, res, next) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Testimonial not found" });
    res.json({ data: item });
  } catch (e) {
    next(e);
  }
};

// Delete by id
const deleteTestimonial = async (req, res, next) => {
  try {
    const doc = await Testimonial.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialById,
};
