const cloudinary = require("cloudinary").v2;

console.log("=== CLOUDINARY CONFIGURATION INITIALIZATION ===");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "PRESENT" : "MISSING");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Cloudinary Resolved Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key_first5: process.env.CLOUDINARY_API_KEY?.substring(0, 5),
  api_key_length: process.env.CLOUDINARY_API_KEY?.length,
  api_secret_first5: process.env.CLOUDINARY_API_SECRET?.substring(0, 5),
  api_secret_length: process.env.CLOUDINARY_API_SECRET?.length
});

module.exports = cloudinary;

