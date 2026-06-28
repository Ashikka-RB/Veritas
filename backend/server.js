// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const uploadRoutes = require("./routes/uploadRoutes");
// const ocrRoutes = require("./routes/ocrRoutes");
// require("dotenv").config();

// const connectDB = require("./config/db");
// const protect = require("./middleware/authMiddleware");

// const authRoutes = require("./routes/authRoutes");

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   })
// );

// app.use(
//   "/uploads",
//   express.static(
//     path.join(__dirname, "uploads")
//   )
// );


// app.use(express.json());


// connectDB();

// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/ocr", ocrRoutes);

// app.get("/", (req, res) => {
//   res.json({
//     message: "Backend Running Successfully"
//   });
// });

// app.get("/api/protected", protect, (req, res) => {

//   res.json({
//     message: "Protected route accessed",
//     user: req.user
//   });

// });

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require("dotenv").config();

const verificationRoutes =
require(
  "./routes/verificationRoutes"
);
const express = require("express");
const cors = require("cors");
const path = require("path");


const connectDB = require("./config/db");

const uploadRoutes = require("./routes/uploadRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const authRoutes = require("./routes/authRoutes");
const adminQueueRoutes = require("./routes/adminQueueRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const testRoutes = require("./routes/testRoutes");

const protect = require("./middleware/authMiddleware");

const app = express();


// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);


// BODY PARSER
app.use(express.json());


// STATIC FILES
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// DB
connectDB();


// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/ocr", ocrRoutes);

app.use("/api/verification",verificationRoutes);

app.use("/api/admin",adminQueueRoutes);

app.use("/api/admin/analytics", adminAnalyticsRoutes);

app.use("/api", dashboardRoutes);
app.use("/api/test", testRoutes);


// TEST ROUTE
app.get("/", (req, res) => {

  res.json({
    message: "Backend Running Successfully"
  });

});


// PROTECTED TEST
app.get(
  "/api/protected",
  protect,
  (req, res) => {

    res.json({
      message: "Protected route accessed",
      user: req.user
    });

  }
);
// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});