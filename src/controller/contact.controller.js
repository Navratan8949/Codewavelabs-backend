const { ContactMessage } = require("../model/contact.model.js");

const { SendVerificationCode } = require("../utils/nodemailer.js");

const TEAM_INBOX = process.env.TEAM_INBOX || process.env.MAIL_FROM;

const renderTeamHtml = (payload) => `
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> ${payload.name}</p>
  <p><strong>Email:</strong> ${payload.email}</p>
  <p><strong>Phone:</strong> ${payload.phone || "-"}</p>
  <p><strong>Company:</strong> ${payload.company || "-"}</p>
  <p><strong>Subject:</strong> ${payload.subject || "-"}</p>
  <p><strong>Message:</strong></p>
  <pre style="white-space:pre-wrap;font-family:system-ui">${
    payload.message
  }</pre>
  <hr/>
  <p>Sent via Codewave Labs website</p>
`;

const renderAckHtml = (payload) => `
  <h2>Thanks for reaching out, ${payload.name}!</h2>
  <p>We’ve received the message and will get back within one business day.</p>
  <p><em>Summary</em></p>
  <ul>
    <li>Subject: ${payload.subject || "-"}</li>
    <li>Company: ${payload.company || "-"}</li>
  </ul>
  <p>— Codewave Labs</p>
`;

const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message } = req.body || {};

    // Minimal server-side validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email and message are required" });
    }

    // Persist in DB
    const doc = await ContactMessage.create({
      name,
      email,
      phone: phone || "",
      company: company || "",
      subject: subject || "",
      message,
    });

    // Send team notification
    await SendVerificationCode({
      from: `"Codewave Labs" <${process.env.MAIL_FROM}>`,
      to: TEAM_INBOX,
      subject: subject
        ? `[Website Contact] ${subject}`
        : "[Website Contact] New message",
      text: `From: ${name} <${email}>\nPhone: ${phone || "-"}\nCompany: ${
        company || "-"
      }\n\n${message}`,
      html: renderTeamHtml({ name, email, phone, company, subject, message }),
      replyTo: email,
    });

    // Send acknowledgment to sender
    await SendVerificationCode({
      from: `"Codewave Labs" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: "We’ve received your message",
      text: `Hi ${name}, thanks for reaching out. We will respond within one business day.\n\n— Codewave Labs`,
      html: renderAckHtml({ name, subject, company }),
    });

    return res
      .status(201)
      .json({ data: { id: doc._id }, message: "Message received" });
  } catch (e) {
    // Optional: log e for diagnostics
    return next(e);
  }
};

// Optional list endpoint for admin use
const listContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(),
    ]);
    res.json({
      data: items,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (e) {
    next(e);
  }
};

const listById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "contactId is required" });
    }

    const contact = await ContactMessage.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ data: contact, success: true });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { contactIds, newStatus } = req.body;

    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({ message: "contactIds array is required" });
    }

    if (!["new", "read", "archived"].includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const result = await ContactMessage.updateMany(
      { _id: { $in: contactIds } },
      { $set: { status: newStatus } }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} contacts`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const updateSingleStatus = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { newStatus } = req.body;

    console.log(contactId, newStatus);

    const result = await ContactMessage.updateOne(
      { _id: contactId },
      { $set: { status: newStatus } }
    );
    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} contact`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await ContactMessage.deleteOne({ _id: contactId });
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} contact`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  listContacts,
  listById,
  bulkUpdateStatus,
  updateSingleStatus,
  deleteContact,
};
