const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify role
      if (decoded.role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Admin access only"
        });
      }

      req.admin = decoded;
      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token"
      });
    }
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error.message);
    return res.status(401).json({
      message: "Token failed or expired"
    });
  }
};

module.exports = adminAuth;
