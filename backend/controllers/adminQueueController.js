const AdminQueue =
require("../models/AdminQueue");

const submitToQueue =
async (req, res) => {

  try {

    const item =
      await AdminQueue.create(
        req.body
      );

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

module.exports = {
  submitToQueue
};