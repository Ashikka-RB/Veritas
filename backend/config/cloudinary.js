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
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? "CONFIGURED" : "NOT CONFIGURED",
  api_secret: cloudinary.config().api_secret ? "CONFIGURED" : "NOT CONFIGURED"
});

module.exports = cloudinary;

