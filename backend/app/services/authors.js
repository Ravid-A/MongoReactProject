const Author = require("../models/authors");
const Book = require("../models/books");

const create = async (name, country) => {
  const author = new Author({ name, country });
  return await author.save();
};

const update = async (strId, author_data) => {
  const author = await Author.findById(strId);
  author.name = author_data.name || author.name;
  author.country = author_data.country || author.country;
  return await author.save();
};

const getAllAuthors = async () => {
  return await Author.find();
};

const getAuthor = async (strId) => {
  return await Author.findById(strId);
};

const getAllBooks = async (strId) => {
  return await Book.find({ authors: strId });
};

module.exports = {
  create,
  update,
  getAllAuthors,
  getAuthor,
  getAllBooks,
};
