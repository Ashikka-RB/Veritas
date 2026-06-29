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
  type: String,
  get: function(v) {
    if (this.aadhaarEncrypted) {
      try {
        const { decrypt } = require("../utils/cryptoHelper");
        return decrypt(this.aadhaarEncrypted);
      } catch (err) {
        console.error("Decryption failed:", err.message);
      }
    }
    return v;
  }
},
aadhaarEncrypted: {
  type: String,
  default: null
},
aadhaarLast4: {
  type: String,
  default: null
},

panName: {
  type: String
},

panDOB: {
  type: String
},

panNumber: {
  type: String,
  get: function(v) {
    if (this.panEncrypted) {
      try {
        const { decrypt } = require("../utils/cryptoHelper");
        return decrypt(this.panEncrypted);
      } catch (err) {
        console.error("Decryption failed:", err.message);
      }
    }
    return v;
  }
},
panEncrypted: {
  type: String,
  default: null
},
panLast4: {
  type: String,
  default: null
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
  faceImage: {
    type: String,
    default: null
  },
  faceMatchScore: {
    type: Number,
    default: null
  },
  faceVerificationStatus: {
    type: String,
    default: null
  },
  faceVerificationTimestamp: {
    type: Date,
    default: null
  },
  ocrConfidence: {
    type: Number,
    default: null
  },
  livenessPassed: {
    type: Boolean,
    default: false
  },
  kycStatus: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: {
    type: String,
    default: null
  },
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});



module.exports = mongoose.model("User", userSchema);