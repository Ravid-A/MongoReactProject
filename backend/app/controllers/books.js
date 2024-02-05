const services = require("../services/books");

const handleCreateForArray = async (books) => {
  const createdBooks = [];
  for (book of books) {
    const createdBook = await services.create(book);
    createdBooks.push(createdBook);
  }
  return createdBooks;
};

const handleCreateForSingle = async (book) => {
  const createdBook = await services.create(book);
  return createdBook;
};

const create = async (req, res) => {
  const body = req.body;

  try {
    const response = Array.isArray(body)
      ? await handleCreateForArray(body)
      : await handleCreateForSingle(body);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedBook = await services.remove(id);
    res.json(deletedBook);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAmountOfPages = async (req, res) => {
  try {
    const amountOfPages = await services.getAmountOfPages();
    res.json(amountOfPages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  const pageNumber = req.params.pageNumber || 1;

  try {
    const books = await services.getAllBooks(pageNumber);
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBooksByStrInTitle = async (req, res) => {
  const pageNumber = req.params.pageNumber || 1;
  const str = req.query.str;

  try {
    const books = await services.getBooksByStrInTitle(str, pageNumber);
    res.json({
      books,
      pageCount: Math.ceil(books.length / 10),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBooksByGenre = async (req, res) => {
  const pageNumber = req.params.pageNumber || 1;
  const genre = req.query.genre;

  try {
    const books = await services.getBooksByGenre(genre, pageNumber);
    res.json({
      books,
      pageCount: Math.ceil(books.length / 10),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBooksByPublishedInRange = async (req, res) => {
  const pageNumber = req.params.pageNumber || 1;
  const startYear = req.query.startYear;
  const endYear = req.query.endYear;

  try {
    const books = await services.getBooksByPublishedInRange(
      startYear,
      endYear,
      pageNumber
    );
    res.json({
      books,
      pageCount: Math.ceil(books.length / 10),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBooksByAuthorCountry = async (req, res) => {
  const pageNumber = req.params.pageNumber || 1;
  const country = req.query.str;

  try {
    const books = await services.getBooksByAuthorCountry(country, pageNumber);
    res.json({
      books,
      pageCount: Math.ceil(books.length / 10),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  remove,
  getAmountOfPages,
  getAllBooks,
  getBooksByStrInTitle,
  getBooksByGenre,
  getBooksByPublishedInRange,
  getBooksByAuthorCountry,
};
