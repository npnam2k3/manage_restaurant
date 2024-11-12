const cloudinary = require("cloudinary").v2;

const deleteFileCloudinary = (filename) => {
  cloudinary.uploader.destroy(filename);
};

module.exports = deleteFileCloudinary;
