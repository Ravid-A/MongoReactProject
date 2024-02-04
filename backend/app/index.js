const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");
const ordersRouter = require("./routes/orders");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/authors", authorsRouter);
app.use("/api/books", booksRouter);
app.use("/api/orders", ordersRouter);

module.exports = app;
