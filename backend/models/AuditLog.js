const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  email: {
    type: String,
    default: null
  },
  eventType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true // 'SUCCESS', 'FAILED', 'PENDING'
  },
  details: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  browser: {
    type: String,
    default: null
  },
  os: {
    type: String,
    default: null
  },
  deviceType: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: "Chennai, IN"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
