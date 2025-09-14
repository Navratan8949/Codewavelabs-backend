const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

console.log("cloud name", process.env.CLOUD_NAME);
console.log("api key", process.env.API_KEY);
console.log("api secret", process.env.API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    console.log("upload image on cloudinary successfully", result.url);
    return result;
  } catch (error) {
    console.log("upload image on cloudinary failed", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteImageOnCloudinary = async (public_Id) => {
  try {
    console.log(
      "delete image on cloudinary progress start ===================",
      public_Id
    );
    const result = await cloudinary.uploader.destroy(public_Id);
    console.log("delete image on cloudinary successfully", result);
    return result;
  } catch (error) {
    console.log("delete image on cloudinary failed", error);
    throw error;
  }
};

module.exports = {
  uploadImageOnCloudinary,
  deleteImageOnCloudinary,
};
