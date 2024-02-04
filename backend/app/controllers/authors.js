const services = require("../services/authors");

const create = async (req, res) => {
  try {
    const { name, country, image } = req.body;
    const newAuthor = await services.create(name, country, image);
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

const deleteAuthor = async (req, res) => {
  try {
    const strId = req.params.id;
    const deletedAuthor = await services.deleteAuthor(strId);
    res.json(deletedAuthor);
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
  deleteAuthor,
};
