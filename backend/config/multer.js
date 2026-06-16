const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
console.log("=== INITIALIZING MULTER CLOUDINARY STORAGE MIDDLEWARE ===");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("MULTER STORAGE: Resolving parameters for uploaded file...", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      userId: req.user ? req.user.id : "unknown"
    });

    let folder = "veritas-ekyc/others";
    if (file.fieldname === "aadhaar") {
      folder = "veritas-ekyc/aadhaar";
    } else if (file.fieldname === "pan") {
      folder = "veritas-ekyc/pan";
    } else if (file.fieldname === "face") {
      folder = "veritas-ekyc/face";
    }

    let publicId = "";
    if (file.fieldname === "face") {
      const userId = req.user ? req.user.id : "unknown";
      publicId = `face_${userId}_${Date.now()}`;
    } else {
      const cleanOriginalName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9-_]/g, "_");
      publicId = `${Date.now()}-${cleanOriginalName}`;
    }

    console.log("MULTER STORAGE: Resolved params:", { folder, public_id: publicId });

    return {
      folder: folder,
      public_id: publicId,
      allowed_formats: ["jpg", "jpeg", "png", "webp"]
    };
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("MULTER FILTER: Verifying file properties...", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype)) {
      console.error("MULTER FILTER REJECTED: Invalid file type:", file.mimetype);
      return cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."));
    }
    console.log("MULTER FILTER: File type verification passed.");
    cb(null, true);
  }
});

module.exports = upload;