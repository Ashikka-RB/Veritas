const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registerUser = async (req, res) => {
  try {

    const { fullName, email, phone, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
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
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first."
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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

const getProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      res.status(200).json(user);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error"
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
      return res.status(400).json({
        message: "Invalid OTP code"
      });
    }

    if (new Date() > user.otpExpiry) {
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

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  sendOtp,
  verifyOtp
};