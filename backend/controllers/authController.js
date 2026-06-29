const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { logSecurityEvent, registerDevice } = require("../utils/auditLogger");

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      await logSecurityEvent(null, "ACCOUNT_CREATION", req, "FAILED", `Registration failed: email ${email} already exists`);
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // create new user
    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry
    });

    // save user to database
    await user.save();

    // Log Account Creation Success
    await logSecurityEvent(user._id, "ACCOUNT_CREATION", req, "SUCCESS", "Account registered successfully (pending OTP verification)");

    // Send OTP email via Nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Veritas eKYC Verification Code",
          text: `Your eKYC verification code is: ${otp}. It will expire in 10 minutes.`
        };
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.log("EMAIL ERROR DURING REGISTRATION:", emailError);
        // Rollback user creation to let them retry
        await User.deleteOne({ _id: user._id });
        return res.status(500).json({
          message: "Failed to send OTP verification email. Please try again."
        });
      }
    } else {
      console.log("WARNING: EMAIL_USER or EMAIL_PASS environment variables are not set!");
      console.log(`[MOCK EMAIL REGISTER] OTP generated for ${email}: ${otp}`);
    }

    res.status(201).json({
      message: "User registered successfully. Verification OTP sent to your email."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });

    if (!user) {
      await logSecurityEvent(null, "LOGIN_FAILURE", req, "FAILED", `Login failed: user not found with email ${email}`);
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      await logSecurityEvent(user._id, "LOGIN_FAILURE", req, "FAILED", `Login failed: account with email ${email} is unverified`);
      return res.status(400).json({
        message: "Please verify your email first."
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logSecurityEvent(user._id, "LOGIN_FAILURE", req, "FAILED", "Login failed: incorrect password");
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Log Successful Login & Register Device
    await logSecurityEvent(user._id, "LOGIN_SUCCESS", req, "SUCCESS", "User logged in successfully");
    await registerDevice(user._id, req);

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Veritas eKYC Verification Code",
        text: `Your new eKYC verification code is: ${otp}. It will expire in 10 minutes.`
      };
      await transporter.sendMail(mailOptions);
    } else {
      console.log("WARNING: EMAIL_USER or EMAIL_PASS environment variables are not set!");
      console.log(`[MOCK EMAIL RESEND] OTP generated for ${email}: ${otp}`);
    }

    res.status(200).json({
      message: "Verification OTP has been resent to your email."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.otp || user.otp !== otp) {
      await logSecurityEvent(user._id, "LOGIN_FAILURE", req, "FAILED", "OTP verification failed: invalid code");
      return res.status(400).json({
        message: "Invalid OTP code"
      });
    }

    if (new Date() > user.otpExpiry) {
      await logSecurityEvent(user._id, "LOGIN_FAILURE", req, "FAILED", "OTP verification failed: code expired");
      return res.status(400).json({
        message: "OTP has expired"
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Log Successful verification and register device
    await logSecurityEvent(user._id, "LOGIN_SUCCESS", req, "SUCCESS", "Email verified & logged in via OTP verification");
    await registerDevice(user._id, req);

    res.status(200).json({
      message: "Email verified successfully",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    // For security reasons, if the user doesn't exist, we still return a successful response.
    // This prevents attackers from guessing registered emails.
    if (!user) {
      console.log(`[forgot-password] Request received for non-existent email: ${email}`);
      await logSecurityEvent(null, "PASSWORD_RESET_REQUEST", req, "FAILED", `Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset link has been sent."
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // Log Password Reset Request
    await logSecurityEvent(user._id, "PASSWORD_RESET_REQUEST", req, "SUCCESS", `Password reset link generated for email: ${email}`);

    // Send reset email
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Veritas eKYC Password Reset Link",
          text: `You requested a password reset for your Veritas eKYC account. Please use the following link to reset your password. It will expire in 15 minutes:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`
        };
        await transporter.sendMail(mailOptions);
        console.log(`[forgot-password] Password reset email sent successfully to ${email}`);
      } catch (emailError) {
        console.error(`[forgot-password] Email sending failed:`, emailError);
      }
    } else {
      console.log("WARNING: EMAIL_USER or EMAIL_PASS environment variables are not set!");
      console.log(`[MOCK EMAIL RESET] Reset link for ${email}: ${resetUrl}`);
    }

    res.status(200).json({
      success: true,
      message: "If this email exists, a reset link has been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required."
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`[reset-password] Password successfully reset for user: ${user.email}`);

    // Log Password Change success
    await logSecurityEvent(user._id, "PASSWORD_CHANGE", req, "SUCCESS", "Password changed successfully via reset token");

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      await logSecurityEvent(req.user.id, "LOGOUT", req, "SUCCESS", "User logged out");
    }
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logoutUser
};