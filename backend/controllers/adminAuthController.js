const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password, accessCode } = req.body;

    if (!email || !password || !accessCode) {
      return res.status(400).json({
        message: "Email, password, and access code are required."
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Access denied"
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        message: "Forbidden: Account is inactive"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (admin.accessCode !== accessCode) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin"
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  adminLogin
};
