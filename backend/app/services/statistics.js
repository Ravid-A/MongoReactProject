const User = require("../models/users");
const Book = require("../models/books");
const Author = require("../models/authors");
const Borrow = require("../models/borrows");

const getStatistics = async (req, res) => {
  const users = await User.countDocuments();
  const books = await Book.countDocuments();
  const authors = await Author.countDocuments();
  const statistics = {
    users,
    books,
    authors,
  };

  return statistics;
};

const getPopularAuthors = async (req, res) => {
  const borrows = await Borrow.aggregate([
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "books", // Replace 'books' with your actual collection name for books
        localField: "items.book",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $unwind: "$bookDetails.authors",
    },
    {
      $project: {
        _id: 1,
        author: "$bookDetails.authors",
      },
    },
    {
      $group: {
        _id: {
          borrowId: "$_id",
          author: "$author",
        },
      },
    },
    {
      $project: {
        _id: "$_id.borrowId",
        author: "$_id.author",
      },
    },
  ]);

  const authors = borrows.reduce((acc, borrow) => {
    const author = borrow.author;

    const authorIndex = acc.findIndex(
      (a) => a._id.toString() === author.toString()
    );

    if (authorIndex === -1) {
      acc.push({ _id: author, count: 1 });
    } else {
      acc[authorIndex].count++;
    }

    return acc;
  }, []);

  const amountOfBorrows = await Borrow.countDocuments();

  const authorsDetails = [];

  for (author of authors) {
    const authorWithDetails = await Author.findById(author._id);

    authorsDetails.push({
      ...authorWithDetails.toObject(),
      precent: ((author.count / amountOfBorrows) * 100).toFixed(2),
    });
  }

  return authorsDetails;
};

const getPopularBooks = async (req, res) => {
  const books = await Borrow.aggregate([
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.book",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const amountOfBorrows = await Borrow.countDocuments();

  const booksDetails = [];

  for (book of books) {
    const bookWithDetails = await Book.findById(book._id);

    booksDetails.push({
      ...bookWithDetails.toObject(),
      precent: ((book.count / amountOfBorrows) * 100).toFixed(2),
    });
  }

  return booksDetails;
};

module.exports = {
  getStatistics,
  getPopularAuthors,
  getPopularBooks,
};
