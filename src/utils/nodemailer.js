const nodemailer = require("nodemailer");
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "navratan0443@gmail.com",
    pass: "vddi lgvz ieby hlmk",
  },
});

const SendVerificationCode = async (options) => {
  try {
    const response = await transporter.sendMail({
      from: options.from || '"CodeDev" <navratan0443@gmail.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo || undefined,
    });

    // console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { SendVerificationCode };
