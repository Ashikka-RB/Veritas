const mongoose =
require("mongoose");

const verificationSchema =
new mongoose.Schema({

  userId: {
    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  },

  faceMatchScore: {
    type: Number
  },

  panMatched: {
    type: Boolean
  },

  livenessPassed: {
    type: Boolean
  },

  ocrConfidence: {
    type: Number
  },

  riskScore: {
    type: Number
  },

  status: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
mongoose.model(
  "Verification",
  verificationSchema
);