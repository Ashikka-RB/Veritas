const AdminQueue = require("../models/AdminQueue");
const User = require("../models/User");
const { logSecurityEvent } = require("../utils/auditLogger");

const submitToQueue =
async (req, res) => {
  console.log("BACKEND RECEIVED SUBMIT BODY:", req.body);
  try {
    const mongoose = require("mongoose");
    const { userId, email } = req.body;

    const isUserIdValid = userId && mongoose.Types.ObjectId.isValid(userId);
    if (isUserIdValid) {
      const user = await User.findById(userId);
      if (user && (user.kycStatus === "rejected" || user.kycStatus === "approved")) {
        return res.status(400).json({ message: "KYC already finalized." });
      }
    }

    const existingQuery = {
      adminDecision: "PENDING",
      ...(isUserIdValid ? { userId } : { email })
    };

    const existing = await AdminQueue.findOne(existingQuery);
    if (existing) {
      console.log("PENDING RECORD ALREADY EXISTS FOR USER, RETURNING EXISTING:", existing);
      return res.status(200).json(existing);
    }

    const item =
      await AdminQueue.create(
        req.body
      );
    console.log("ADMINQUEUE DOCUMENT SAVED IN MONGODB:", item);
    
    if (item.userId) {
      await User.findByIdAndUpdate(item.userId, { kycStatus: "under_review" });
      await logSecurityEvent(item.userId, "ADMIN_REVIEW_SUBMISSION", req, "SUCCESS", "Application submitted to admin review queue");
    }

    res.status(201).json(item);

  } catch (error) {

  console.log(
    "ADMIN QUEUE ERROR:",
    error
  );

  if (error.code === 11000) {
    console.log("CONCURRENT SUBMISSION DETECTED (DUPLICATE KEY 11000). RETRIEVING EXISTING PENDING RECORD.");
    try {
      const mongoose = require("mongoose");
      const { userId, email } = req.body;
      const isUserIdValid = userId && mongoose.Types.ObjectId.isValid(userId);
      const existingQuery = {
        adminDecision: "PENDING",
        ...(isUserIdValid ? { userId } : { email })
      };
      const existing = await AdminQueue.findOne(existingQuery);
      if (existing) {
        return res.status(200).json(existing);
      }
    } catch (findError) {
      console.log("Error finding existing record after 11000:", findError);
    }
  }

  res.status(500).json({

    message:
      "Failed to submit",

    error:
      error.message

  });

}

};

const getReviewQueue =
async (req, res) => {

  try {

    const records =
      await AdminQueue.find({
        adminDecision:
          "PENDING"
      }).populate("userId");
    console.log("BACKEND RETRIEVED REVIEW QUEUE:", records);
    res.json(records);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch queue",
      error: error.message
    });

  }

};

const getSingleQueueItem =
async (req, res) => {
  console.log("BACKEND FETCHING REVIEW ITEM FOR ID:", req.params.id);
  try {

    const record =
      await AdminQueue.findById(
        req.params.id
      );

    if (!record) {
      console.log("BACKEND REVIEW ITEM NOT FOUND FOR ID:", req.params.id);
      return res.status(404).json({
        message: "Record not found"
      });
    }
    console.log("BACKEND RETRIEVED QUEUE RECORD:", record);

    let userDoc = null;
    if (record.userId) {
      userDoc = await User.findById(record.userId).select("-password");
      console.log("BACKEND LOOKED UP USER DOCUMENT:", userDoc);
    } else {
      console.log("BACKEND: NO userId ON QUEUE RECORD TO LOOK UP USER!");
    }

    const responseData = {
      queue: record,
      user: userDoc
    };
    console.log("BACKEND RETURNING RESPONSE TO FRONTEND:", responseData);
    res.json(responseData);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch record",
      error: error.message
    });

  }

};

const approveUser =
async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const record = await AdminQueue.findByIdAndUpdate(
      req.params.id,
      {
        adminDecision: "APPROVED",
        finalStatus: "APPROVED",
        adminNotes: adminNotes || "",
        decidedAt: new Date()
      },
      { new: true }
    );

    if (record && record.userId) {
      await User.findByIdAndUpdate(record.userId, { kycStatus: "approved", isLocked: false });
      await logSecurityEvent(record.userId, "ADMIN_DECISION", req, "SUCCESS", `KYC approved by administrator. Notes: ${adminNotes || "None"}`);
    }

    res.json({
      success: true,
      record
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to approve",
      error: error.message
    });
  }
};

const rejectUser =
async (req, res) => {
  try {
    const { adminNotes } = req.body;
    if (!adminNotes) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    const record = await AdminQueue.findByIdAndUpdate(
      req.params.id,
      {
        adminDecision: "REJECTED",
        finalStatus: "REJECTED",
        adminNotes: adminNotes,
        rejectionReason: adminNotes,
        decidedAt: new Date()
      },
      { new: true }
    );

    if (record && record.userId) {
      await User.findByIdAndUpdate(record.userId, { kycStatus: "rejected", rejectionReason: adminNotes, isLocked: false });
      await logSecurityEvent(record.userId, "ADMIN_DECISION", req, "SUCCESS", `KYC rejected by administrator. Reason: ${adminNotes}`);
    }

    res.json({
      success: true,
      record
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to reject",
      error: error.message
    });
  }
};

const reuploadUser =
async (req, res) => {
  try {
    const { adminNotes } = req.body;
    if (!adminNotes) {
      return res.status(400).json({ message: "Reason for re-upload is required." });
    }

    const record = await AdminQueue.findByIdAndUpdate(
      req.params.id,
      {
        adminDecision: "REUPLOAD_REQUIRED",
        finalStatus: "REUPLOAD_REQUIRED",
        adminNotes: adminNotes,
        reuploadReason: adminNotes,
        decidedAt: new Date()
      },
      { new: true }
    );

    if (record && record.userId) {
      await User.findByIdAndUpdate(record.userId, { kycStatus: "pending", isLocked: false });
      await logSecurityEvent(record.userId, "ADMIN_DECISION", req, "SUCCESS", `Re-upload requested by administrator. Reason: ${adminNotes}`);
    }

    res.json({
      success: true,
      record
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to request re-upload",
      error: error.message
    });
  }
};

const flagFraudUser =
async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const record = await AdminQueue.findByIdAndUpdate(
      req.params.id,
      {
        adminDecision: "FLAGGED",
        finalStatus: "FLAGGED",
        adminNotes: adminNotes || "Flagged as fraud",
        decidedAt: new Date()
      },
      { new: true }
    );

    if (record && record.userId) {
      await User.findByIdAndUpdate(record.userId, { kycStatus: "rejected", rejectionReason: adminNotes || "Flagged as fraud", isLocked: true });
      await logSecurityEvent(record.userId, "ADMIN_DECISION", req, "SUCCESS", `KYC flagged as fraud by administrator. Notes: ${adminNotes || "Flagged as fraud"}`);
    }

    res.json({
      success: true,
      record
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to flag fraud",
      error: error.message
    });
  }
};

module.exports = {
  submitToQueue,
  getReviewQueue,
  getSingleQueueItem,
  approveUser,
  rejectUser,
  reuploadUser,
  flagFraudUser
};