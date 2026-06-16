const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    const email = "admin@veritas.com";
    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log("Admin account (admin@veritas.com) already exists. Skipping seeding.");
      process.exit(0);
    }

    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    console.log("Creating admin document...");
    const admin = new Admin({
      name: "System Administrator",
      email,
      password: hashedPassword,
      accessCode: "123456",
      role: "admin",
      isActive: true
    });

    await admin.save();
    console.log("Admin account successfully seeded in MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
