const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const borrowSchema = new Schema({
  items: [
    {
      book: { type: Schema.Types.ObjectId, ref: "Books" },
      amount: Number,
    },
  ],
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  returned: { type: Boolean, default: false },
  returnDate: {
    type: Date,
    default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

const Borrow = model("Borrow", borrowSchema);

module.exports = Borrow;
