// src/controllers/project.controller.js
const { Project } = require("../model/Project.model.js");
const {
  uploadImageOnCloudinary,
  deleteImageOnCloudinary,
} = require("../utils/cloudinary.js");

// Create (POST /api/projects) — multipart: fields + gallery (multiple)
exports.createProject = async (req, res, next) => {
  try {
    const b = req.body;
    console.log("create project", b);
    const doc = new Project({
      title: b.title,
      slug: b.slug,
      category: b.category || "Website",
      projectLink: b.projectLink || "",
      description: b.description || "",
      longDescription: b.longDescription || "",
      technologies: b.technologies
        ? String(b.technologies)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      features: b.features
        ? String(b.features)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      client: b.client || "",
      duration: b.duration || "",
      year: b.year || "",
      liveUrl: b.liveUrl || "",
      githubUrl: b.githubUrl || "",
      tags: b.tags
        ? String(b.tags)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      published: b.published === "false" ? false : true,
      images: [],
    });

    if (req.files?.images?.length) {
      for (const f of req.files.images) {
        const up = await uploadImageOnCloudinary(f.path);
        if (up)
          doc.images.push({
            url: up.secure_url || up.url,
            public_id: up.public_id,
          });
      }
    }

    const saved = await doc.save();
    res.status(201).json({ data: saved });
  } catch (e) {
    next(e);
  }
};

// List (GET /api/projects)
exports.getProjects = async (req, res, next) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (e) {
    next(e);
  }
};

// Read one (GET /api/projects/:id)
exports.getProjectById = async (req, res, next) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Project not found" });
    res.json({ data: item });
  } catch (e) {
    next(e);
  }
};

// Update (PATCH /api/projects/:id) — add new gallery images if sent
exports.updateProject = async (req, res, next) => {
  try {
    const id = req.params.id;
    const current = await Project.findById(id);
    if (!current) return res.status(404).json({ error: "Project not found" });

    // Shallow updates
    const b = req.body;
    if (b.title !== undefined) current.title = b.title;
    if (b.category !== undefined) current.category = b.category;
    if (b.projectLink !== undefined) current.projectLink = b.projectLink;
    if (b.description !== undefined) current.description = b.description;
    if (b.longDescription !== undefined)
      current.longDescription = b.longDescription;
    if (b.technologies !== undefined)
      current.technologies = String(b.technologies)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (b.features !== undefined)
      current.features = String(b.features)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (b.client !== undefined) current.client = b.client;
    if (b.duration !== undefined) current.duration = b.duration;
    if (b.year !== undefined) current.year = b.year;
    if (b.liveUrl !== undefined) current.liveUrl = b.liveUrl;
    if (b.githubUrl !== undefined) current.githubUrl = b.githubUrl;
    if (b.tags !== undefined)
      current.tags = String(b.tags)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (b.published !== undefined)
      current.published = b.published === "true" || b.published === true;

    // Add new images to images
    if (req.files?.images?.length) {
      for (const f of req.files.images) {
        const up = await uploadImageOnCloudinary(f.path);
        if (up)
          current.images.push({
            url: up.secure_url || up.url,
            public_id: up.public_id,
          });
      }
    }

    // Optional delete images by public_id (CSV or array)
    if (b.removePublicIds) {
      const ids = Array.isArray(b.removePublicIds)
        ? b.removePublicIds
        : String(b.removePublicIds)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      if (ids.length) {
        for (const id of ids) {
          try {
            await deleteImageOnCloudinary(id);
          } catch {}
        }
        current.images = current.images.filter(
          (img) => !ids.includes(img.public_id)
        );
      }
    }

    const saved = await current.save();
    res.json({ data: saved });
  } catch (e) {
    next(e);
  }
};

// Delete (DELETE /api/projects/:id) — also delete images on Cloudinary
exports.deleteProject = async (req, res, next) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Project not found" });

    if (Array.isArray(item.images)) {
      for (const img of item.images) {
        if (img?.public_id) {
          try {
            await deleteImageOnCloudinary(img.public_id);
          } catch {}
        }
      }
    }
    res.json({ data: item });
  } catch (e) {
    next(e);
  }
};
