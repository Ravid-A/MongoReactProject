const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: String,
  publishingYear: Number,
  genres: [String],
  cover_image: String,
  authors: [{ type: Schema.Types.ObjectId, ref: "Authors" }],
  quantity: Number,
  createdAt: { type: Date, default: Date.now },
});

const Book = model("Books", bookSchema);

module.exports = Book;
