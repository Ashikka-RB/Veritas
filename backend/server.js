const express = require("express");
const cors = require("cors");
const path = require("path");

const uploadRoutes = require("./routes/uploadRoutes");
require("dotenv").config();

const connectDB = require("./config/db");
const protect = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Running Successfully"
  });
});

app.get("/api/protected", protect, (req, res) => {

  res.json({
    message: "Protected route accessed",
    user: req.user
  });

});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});