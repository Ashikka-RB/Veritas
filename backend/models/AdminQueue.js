const mongoose =
require("mongoose");

const adminQueueSchema =
new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  fullName: {
    type: String,
    default: null
  },

  email: {
    type: String,
    default: null
  },

  phone: {
    type: String,
    default: null
  },

  faceMatchScore: Number,

  ocrConfidence: Number,

  finalStatus: String,

  approvedProbability: Number,

  manualReviewProbability: Number,

  rejectedProbability: Number,

  adminNotes: {
    type: String,
    default: null
  },

  rejectionReason: {
    type: String,
    default: null
  },

  reuploadReason: {
    type: String,
    default: null
  },

  adminDecision: {
    type: String,
    default: "PENDING"
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }

});

adminQueueSchema.index(
  { userId: 1, email: 1 },
  { 
    unique: true, 
    partialFilterExpression: { 
      adminDecision: "PENDING"
    } 
  }
);

module.exports =
mongoose.model(
  "AdminQueue",
  adminQueueSchema
);