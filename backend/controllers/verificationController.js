const Verification =
require("../models/Verification");

const saveVerification =
async (req, res) => {

  try {

    const verification =
      await Verification.create(
        req.body
      );

    res.status(201).json(
      verification
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to save verification"
    });

  }

};

module.exports = {
  saveVerification
};