const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");
const ordersRouter = require("./routes/orders");
const genresRouter = require("./routes/genres");
const countriesRouter = require("./routes/countries");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/authors", authorsRouter);
app.use("/api/books", booksRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/genres", genresRouter);
app.use("/api/countries", countriesRouter);

module.exports = app;
