const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/face";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: face_<userId>_<timestamp>.jpg
    const userId = req.user.id;
    const timestamp = Date.now();
    cb(null, `face_${userId}_${timestamp}.jpg`);
  }
});

const uploadFace = multer({ storage });
module.exports = uploadFace;
