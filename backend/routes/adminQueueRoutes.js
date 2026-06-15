const express = require("express");
const router = express.Router();

const {
  submitToQueue,
  getReviewQueue,
  getSingleQueueItem,
  approveUser,
  rejectUser,
  reuploadUser
} = require("../controllers/adminQueueController");

router.post("/submit", submitToQueue);
router.get("/review-queue", getReviewQueue);
router.get("/review-queue/:id", getSingleQueueItem);
router.get("/review-item/:id", getSingleQueueItem);
router.post("/approve/:id", approveUser);
router.post("/reject/:id", rejectUser);
router.post("/reupload/:id", reuploadUser);

module.exports = router;