const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
});

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
