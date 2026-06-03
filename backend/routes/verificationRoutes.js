const express =
require("express");

const router =
express.Router();

const {
  saveVerification,
  analyzeVerification
} =
require(
  "../controllers/verificationController"
);

router.post(
  "/save",
  saveVerification
);

router.post(
  "/analyze",
  analyzeVerification
);

module.exports =
router;
