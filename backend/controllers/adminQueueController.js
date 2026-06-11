const AdminQueue =
require("../models/AdminQueue");
const User = require("../models/User");

const submitToQueue =
async (req, res) => {
  console.log("BACKEND RECEIVED SUBMIT BODY:", req.body);
  try {

    const item =
      await AdminQueue.create(
        req.body
      );
    console.log("ADMINQUEUE DOCUMENT SAVED IN MONGODB:", item);
    res.status(201).json(item);

  } catch (error) {

  console.log(
    "ADMIN QUEUE ERROR:",
    error
  );

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

    await AdminQueue.findByIdAndUpdate(
      req.params.id,
      {
        adminDecision:
          "APPROVED"
      }
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to approve"
    });

  }

};

const rejectUser =
async (req, res) => {

  try {

    await AdminQueue.findByIdAndUpdate(
      req.params.id,
      {
        adminDecision:
          "REJECTED"
      }
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to reject"
    });

  }

};

module.exports = {
  submitToQueue,
  getReviewQueue,
  getSingleQueueItem,
  approveUser,
  rejectUser
};