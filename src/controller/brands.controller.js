const { Logo } = require("../model/brands.model.js");
const {
  uploadImageOnCloudinary,
  deleteImageOnCloudinary,
} = require("../utils/cloudinary.js");

// GET /api/logos
const listLogos = async (req, res, next) => {
  try {
    const items = await Logo.find({ active: true }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json({ data: items });
  } catch (e) {
    next(e);
  }
};

const getlogoById = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ message: "logo not found." });
    }

    res.status(200).json({ data: logo, success: true });
  } catch (error) {
    next(error);
  }
};

const createLogo = async (req, res, next) => {
  try {
    const { order } = req.body;

    let logoUrl = null;

    if (req.file) {
      const up = await uploadImageOnCloudinary(req.file.path);
      if (up) {
        logoUrl = {
          url: up.secure_url || up.url,
          public_id: up.public_id,
        };
      }
    }

    const doc = await Logo.create({ logoUrl, order, active: true });
    res.status(201).json({ data: doc });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/logos/:id
const updateLogo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await Logo.findById(id);
    if (!current) return res.status(404).json({ error: "Brand not found" });

    // Shallow updates from request body
    const { order, active, removeLogoId } = req.body;
    if (order !== undefined) current.order = parseInt(order, 10) || 0;
    if (active !== undefined)
      current.active = active === "true" || active === true;

    // Handle logo upload
    if (req.file?.path) {
      // Delete existing logo if it exists
      if (current.logoUrl?.public_id) {
        try {
          await deleteImageOnCloudinary(current.logoUrl.public_id);
        } catch (err) {
          console.error(`Failed to delete old logo: ${err.message}`);
        }
      }
      // Upload new logo
      const up = await uploadImageOnCloudinary(req.file.path);
      if (!up) {
        return res.status(400).json({ error: "Failed to upload logo" });
      }
      current.logoUrl = {
        url: up.secure_url || up.url,
        public_id: up.public_id,
      };
    }

    // Handle logo removal
    if (removeLogoId && current.logoUrl?.public_id === removeLogoId) {
      try {
        await deleteImageOnCloudinary(current.logoUrl.public_id);
        current.logoUrl = null;
      } catch (err) {
        console.error(`Failed to delete logo: ${err.message}`);
      }
    }

    const saved = await current.save();
    res.json({ data: saved });
  } catch (e) {
    next(e);
  }
};

// DELETE /api/logos/:id
const deleteLogo = async (req, res, next) => {
  try {
    const doc = await Logo.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
};

module.exports = { listLogos, getlogoById, createLogo, updateLogo, deleteLogo };
