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
        aadhaarFile: filePath
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

module.exports = {
  uploadAadhaar
};