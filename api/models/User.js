const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: new Date() },
});

module.exports = mongoose.model("User", userSchema);
