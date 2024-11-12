const cloudinary = require("../configs/cloudinary.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "manage_restaurant",
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
