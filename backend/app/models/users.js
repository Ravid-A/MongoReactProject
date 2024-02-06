const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  privilage: { type: Number, default: false },
  created_at: { type: Date, default: Date.now },
});

const User = model("User", userSchema);

module.exports = User;
