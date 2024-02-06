const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");
const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");
const borrowsRouter = require("./routes/borrows");
const genresRouter = require("./routes/genres");
const countriesRouter = require("./routes/countries");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/books", booksRouter);
app.use("/api/borrows", borrowsRouter);
app.use("/api/genres", genresRouter);
app.use("/api/countries", countriesRouter);

module.exports = app;
