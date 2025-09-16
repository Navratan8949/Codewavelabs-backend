const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const projectRoutes = require("./src/routes/project.routes.js");
const brandRoutes = require("./src/routes/brands.routes.js");
const teamRoutes = require("./src/routes/team.routes.js");
const testimonialRoutes = require("./src/routes/testimonial.routes.js");
const achievementRoutes = require("./src/routes/achievement.routes.js");
const contactRoutes = require("./src/routes/contact.routes.js");

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN,
      "http://localhost:3000",
      "http://localhost:4000",
      "https://codewavelabs-two.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the Digital Wallet API");
});

app.use("/api/projects", projectRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
