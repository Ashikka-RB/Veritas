const express =
require("express");

const router =
express.Router();

const {
  saveVerification
} =
require(
  "../controllers/verificationController"
);

router.post(
  "/save",
  saveVerification
);

module.exports =
router;
