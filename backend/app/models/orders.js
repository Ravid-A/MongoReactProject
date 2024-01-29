const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  items: [
    {
      book: { type: Schema.Types.ObjectId, ref: "Books" },
      amount: Number,
    },
  ],
  totalPrice: Number,
  date: { type: Date, default: Date.now },
});

const Order = model("Orders", orderSchema);

module.exports = Order;
