const axios = require("/Users/ashikkarb/eKYC/backend/node_modules/axios");
const mongoose = require("/Users/ashikkarb/eKYC/backend/node_modules/mongoose");
const bcrypt = require("/Users/ashikkarb/eKYC/backend/node_modules/bcryptjs");
const MONGO_URI = "mongodb+srv://ashikka2006_db_user:Veritas123@cluster0.foa9kee.mongodb.net/?appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;

    const email = "reset_test@example.com";
    const oldPassword = "OldPassword@123";
    const newPassword = "NewPassword@123";

    // 1. Cleanup old test data
    console.log("Cleaning up test data...");
    await db.collection("users").deleteOne({ email });

    // 2. Register test user
    console.log("Creating test user...");
    const hashedPassword = await bcrypt.hash(oldPassword, 10);
    await db.collection("users").insertOne({
      fullName: "Password Reset Test User",
      email,
      phone: "9999999999",
      password: hashedPassword,
      isVerified: true, // Bypass OTP checks
      createdAt: new Date()
    });

    // Verify initial login succeeds with old password
    console.log("Verifying initial login with old password...");
    const loginOldRes = await axios.post("https://veritas-backend-3nfm.onrender.com/api/auth/login", {
      email,
      password: oldPassword
    });
    console.log("Initial login status (expected 200):", loginOldRes.status);
    console.log("Initial login token exists?", !!loginOldRes.data.token);

    // 3. Request Forgot Password
    console.log("\n--- Triggering Forgot Password ---");
    const forgotRes = await axios.post("https://veritas-backend-3nfm.onrender.com/api/auth/forgot-password", { email });
    console.log("Forgot Password response status (expected 200):", forgotRes.status);
    console.log("Forgot Password response message:", forgotRes.data.message);

    // 4. Verify token and expiry are set in the database
    console.log("Reading reset fields from database...");
    const userDoc = await db.collection("users").findOne({ email });
    console.log("resetPasswordToken is set?", !!userDoc.resetPasswordToken);
    console.log("resetPasswordExpires is set?", !!userDoc.resetPasswordExpires);
    if (userDoc.resetPasswordExpires) {
      const remainingTimeMins = Math.round((new Date(userDoc.resetPasswordExpires) - new Date()) / 60000);
      console.log(`Token expires in (expected ~15 mins): ${remainingTimeMins} minutes`);
    }

    const token = userDoc.resetPasswordToken;

    // 5. Trigger Reset Password
    console.log("\n--- Triggering Reset Password with Token ---");
    const resetRes = await axios.post("https://veritas-backend-3nfm.onrender.com/api/auth/reset-password", {
      token,
      newPassword
    });
    console.log("Reset Password response status (expected 200):", resetRes.status);
    console.log("Reset Password message:", resetRes.data.message);

    // 6. Verify token is cleared in the database (Single-use check)
    const updatedUserDoc = await db.collection("users").findOne({ email });
    console.log("resetPasswordToken cleared? (expected null):", updatedUserDoc.resetPasswordToken);
    console.log("resetPasswordExpires cleared? (expected null):", updatedUserDoc.resetPasswordExpires);

    // 7. Verify login with NEW password succeeds
    console.log("\n--- Verifying login with NEW password ---");
    const loginNewRes = await axios.post("https://veritas-backend-3nfm.onrender.com/api/auth/login", {
      email,
      password: newPassword
    });
    console.log("Login with new password status (expected 200):", loginNewRes.status);
    console.log("New token exists?", !!loginNewRes.data.token);

    // 8. Verify login with OLD password fails
    console.log("\n--- Verifying login with OLD password fails ---");
    try {
      await axios.post("https://veritas-backend-3nfm.onrender.com/api/auth/login", {
        email,
        password: oldPassword
      });
      console.log("ERROR: Logged in with old password after reset!");
    } catch (err) {
      console.log("Login with old password status (expected 400/401):", err.response.status);
      console.log("Rejection message:", err.response.data.message);
    }

    // 9. Cleanup
    await db.collection("users").deleteOne({ email });
    console.log("Cleanup complete.");

  } catch (err) {
    console.error("Verification failed:", err.message, err.response ? err.response.data : "");
  } finally {
    await mongoose.disconnect();
  }
}

run();
