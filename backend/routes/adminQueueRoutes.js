const express = require("express");
const router = express.Router();

const {
  submitToQueue,
  getReviewQueue,
  getSingleQueueItem,
  approveUser,
  rejectUser
} = require("../controllers/adminQueueController");

router.post("/submit", submitToQueue);
router.get("/review-queue", getReviewQueue);
router.get("/review-queue/:id", getSingleQueueItem);
router.get("/review-item/:id", getSingleQueueItem);
router.put("/approve/:id", approveUser);
router.put("/reject/:id", rejectUser);

module.exports = router;