const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected", conn.connection.host);
  } catch (error) {
    console.log("mongodb connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
