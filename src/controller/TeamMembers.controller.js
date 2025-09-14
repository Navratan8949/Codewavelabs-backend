const { TeamMember } = require("../model/teammember.model.js");
const { uploadImageOnCloudinary } = require("../utils/cloudinary.js");

// list
const listTeam = async (req, res, next) => {
  try {
    const items = await TeamMember.find({ active: true }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json({ data: items });
  } catch (e) {
    next(e);
  }
};

const getTeamMemberById = async (req, res, next) => {
  try {
    const item = await TeamMember.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Team member not found" });
    res.json({ data: item });
  } catch (e) {
    next(e);
  }
};

// create
const createMember = async (req, res, next) => {
  try {
    const {
      name,
      email,
      role,
      linkedin,
      description,
      expertise,
      iconKey,
      active,
      order,
    } = req.body;

    let img = null;

    // Upload single image
    if (req.file) {
      const up = await uploadImageOnCloudinary(req.file.path);
      if (up) {
        img = {
          url: up.secure_url || up.url,
          public_id: up.public_id,
        };
      }
    }

    const newMember = await TeamMember.create({
      name,
      email,
      role,
      linkedin,
      description,
      expertise,
      iconKey,
      active: active === "false" ? false : true,
      order,
      img,
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: newMember,
    });
  } catch (e) {
    next(e);
  }
};

// update
const updateMember = async (req, res, next) => {
  try {
    console.log(req.body);

    const {
      name,
      email,
      role,
      linkedin,
      description,
      expertise,
      iconKey,
      active,
      order,
    } = req.body;

    let updateData = {
      name,
      email,
      role,
      linkedin,
      description,
      expertise,
      iconKey,
      active,
      order,
    };

    // agar nayi image upload hui hai
    if (req.file) {
      const up = await uploadImageOnCloudinary(req.file.path);
      if (up) {
        updateData.img = {
          url: up.secure_url || up.url,
          public_id: up.public_id,
        };
      }
    }

    const doc = await TeamMember.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!doc) return res.status(404).json({ error: "Not found" });

    res.json({
      success: true,
      message: "Team member updated successfully",
      data: doc,
    });
  } catch (e) {
    next(e);
  }
};

// delete
const deleteMember = async (req, res, next) => {
  try {
    const doc = await TeamMember.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listTeam,
  getTeamMemberById,
  createMember,
  updateMember,
  deleteMember,
};
