const Verification =
require("../models/Verification");

const axios =
require("axios");

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

const analyzeVerification =
async (req, res) => {

  try {

    const response =
      await axios.post(
        "http://127.0.0.1:5001/predict",
        req.body
      );

    res.json(
      response.data
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "ML Analysis Failed"
    });

  }

};

module.exports = {
  saveVerification,
  analyzeVerification
};