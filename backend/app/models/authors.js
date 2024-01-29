const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const authorSchema = new Schema({
  name: String,
  country: String,
  createdAt: { type: Date, default: Date.now },
});

const Author = model("Authors", authorSchema);

module.exports = Author;
