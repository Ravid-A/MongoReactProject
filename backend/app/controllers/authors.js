const services = require("../services/authors");

const create = async (req, res) => {
  try {
    const { name, country } = req.body;
    const newAuthor = await services.create(name, country);
    res.json(newAuthor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const strId = req.params.id;
    const author_data = req.body;
    const updatedAuthor = await services.update(strId, author_data);
    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await services.getAllAuthors();
    res.json(authors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAuthor = async (req, res) => {
  try {
    const strId = req.params.id;
    const author = await services.getAuthor(strId);
    res.json(author);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const strId = req.params.id;
    const books = await services.getAllBooks(strId);
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  update,
  getAllAuthors,
  getAuthor,
  getAllBooks,
};
