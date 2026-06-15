const User = require("../models/User");

const uploadAadhaar = async (req, res) => {

  try {

    // logged in user id from JWT
    const userId = req.user.id;

    // uploaded file path
    const filePath = req.file.path;

    // update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        aadhaarFile: filePath,
        aadhaarUploadedAt: new Date()
      },
      {
        new: true
      }
    );

    res.status(200).json({
      message: "Aadhaar uploaded successfully",
      user: updatedUser
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

const uploadPan = async (req, res) => {

  try {

    const userId = req.user.id;

    const filePath = req.file.path;

    const updatedUser =
      await User.findByIdAndUpdate(

        userId,

        {
          panFile: filePath,
          panUploadedAt: new Date()
        },

        {
          new: true
        }

      );

    res.status(200).json({
      message: "PAN uploaded successfully",
      user: updatedUser
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

module.exports = {
  uploadAadhaar,
  uploadPan
};