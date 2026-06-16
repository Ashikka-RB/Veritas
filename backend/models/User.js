const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String,
    default: null
  },

  otpExpiry: {
    type: Date,
    default: null
  },

  aadhaarUploadedAt: {
    type: Date,
    default: null
  },

  ocrCompletedAt: {
    type: Date,
    default: null
  },

  panUploadedAt: {
    type: Date,
    default: null
  },

  aadhaarFile: {
  type: String
},

panFile: {
  type: String
},

  createdAt: {
    type: Date,
    default: Date.now
  },

  aadhaarName: {
  type: String
},

aadhaarDOB: {
  type: String
},

aadhaarGender: {
  type: String
},

aadhaarNumber: {
  type: String
},

panName: {
  type: String
},

panDOB: {
  type: String
},

  panNumber: {
  type: String
},
  isLocked: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
});



module.exports = mongoose.model("User", userSchema);