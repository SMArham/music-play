const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const uri = process.env.URI;
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(uri);

    if (connect) {
      console.log("MongoDB is Connected");
    } else {
      console.log("MongoDB is Not Connected");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
