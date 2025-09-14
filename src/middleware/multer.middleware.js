const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/temp"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-name-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
    ].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type , only JPEG, PNG, JPG and PDF are allowed")
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //max file size : 5 MB
  },
  fileFilter,
});

module.exports = upload;
