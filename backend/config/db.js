const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected to:");
    console.log("- Host:", conn.connection.host);
    console.log("- Port:", conn.connection.port);
    console.log("- Database Name:", conn.connection.name);
    console.log("- Mongoose Collections in use:", Object.keys(conn.connection.collections));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;