const ObjectId = require("mongoose").Types.ObjectId;

const Book = require("../models/books");
const Author = require("../models/authors");

const authorExists = async (strId) =>
  ObjectId.isValid(strId) && !!(await Author.findOne({ _id: strId }));

const create = async (book_data) => {
  const { title, publishingYear, genres, cover_image, authors, quantity } =
    book_data;

  for (author of authors) {
    if (!(await authorExists(author))) {
      throw new Error("Author does not exist");
    }
  }

  const book = new Book({
    title,
    publishingYear,
    genres,
    cover_image,
    authors,
    quantity,
  });

  return await book.save();
};

const remove = async (strId) => {
  return await Book.findByIdAndDelete(strId);
};

const getBookById = async (strId) => {
  return await Book.findById(strId).populate("authors");
};

const getAmountOfBooks = async () => {
  return await Book.countDocuments();
};

const getAmountOfPages = async () => {
  const booksAmount = await Book.countDocuments();
  return Math.ceil(booksAmount / 10);
};

const getAllBooks = async (pageNumber) => {
  return await Book.find()
    .populate("authors")
    .skip(pageNumber > 0 ? (pageNumber - 1) * 10 : 0)
    .limit(pageNumber > 0 ? 10 : getAmountOfBooks());
};

const getBooksByStrInTitle = async (str, pageNumber) => {
  return await Book.find({
    title: { $regex: str },
  })
    .populate("authors")
    .skip((pageNumber - 1) * 10)
    .limit(10);
};

const getBooksByGenre = async (genre, pageNumber) => {
  return await Book.find({ genres: genre })
    .populate("authors")
    .skip((pageNumber - 1) * 10)
    .limit(10);
};

const getBooksByPublishedInRange = async (startYear, endYear, pageNumber) => {
  return await Book.find({ publishingYear: { $gte: startYear, $lte: endYear } })
    .populate("authors")
    .skip((pageNumber - 1) * 10)
    .limit(10);
};

const getBooksByAuthorCountry = async (country, pageNumber) => {
  return await Book.aggregate([
    {
      $lookup: {
        from: "authors",
        localField: "authors",
        foreignField: "_id",
        as: "authors",
      },
    },
    {
      $match: {
        "authors.country": {
          $regex: country,
          $options: "i",
        },
      },
    },
  ])
    .skip((pageNumber - 1) * 10)
    .limit(10);
};

module.exports = {
  create,
  remove,
  getBookById,
  getAmountOfPages,
  getAllBooks,
  getBooksByStrInTitle,
  getBooksByGenre,
  getBooksByPublishedInRange,
  getBooksByAuthorCountry,
};
