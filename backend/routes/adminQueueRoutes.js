const express =
require("express");

const router =
express.Router();

const {
  submitToQueue
} =
require(
  "../controllers/adminQueueController"
);

router.post(
  "/submit",
  submitToQueue
);

module.exports =
router;