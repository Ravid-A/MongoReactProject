const Borrow = require("../models/borrows");
const Book = require("../models/books");
const Author = require("../models/authors");

const checkBooksQuantity = async (items, books) => {
  for (item of items) {
    for (book of books) {
      if (item.book === book._id.toString()) {
        if (item.amount > book.quantity) {
          const error = new Error(`Not enough books in stock`);
          error.book = book;
          error.status = 400;
          throw error;
        }
      }
    }
  }
};

const updateBooksQuantity = async (items, books) => {
  for (item of items) {
    if (!item.amount) {
      const error = new Error(`Amount of books must be greater than 0`);
      error.book = book;
      error.status = 400;
      throw error;
    }

    for (book of books) {
      if (item.book === book._id.toString()) {
        book.quantity -= item.amount;
        await book.save();
      }
    }
  }
};

const create = async (borrow, user_data) => {
  let items = [];

  if (!borrow.books) {
    const book = borrow.book;

    //Case of 1 item
    const item = {
      book: book.id,
      amount: book.amount,
    };

    items.push(item);
  } else {
    items = borrow.books.map((item) => {
      return {
        book: item.id,
        amount: item.amount,
      };
    });
  }

  const books = await Book.find({
    _id: { $in: items.map((item) => item.book) },
  });

  await checkBooksQuantity(items, books);
  await updateBooksQuantity(items, books);

  const newBorrow = new Borrow({
    items: items.map((item) => {
      return { book: item.book, amount: item.amount };
    }),
    user: user_data._id,
  });
  return await newBorrow.save();
};

const returnBorrow = async (id, user_data) => {
  const borrowToReturn = await Borrow.findById(id);

  if (!borrowToReturn) {
    throw new Error("Borrow not found");
  }

  if (borrowToReturn.user.toString() !== user_data._id.toString()) {
    throw new Error("You are not allowed to return this borrow");
  }

  if (borrowToReturn.returned) throw new Error("Borrow already returned");

  const books = await Book.find({
    _id: { $in: borrowToReturn.items.map((item) => item.book) },
  });

  for (item of borrowToReturn.items) {
    for (book of books) {
      if (item.book.toString() === book._id.toString()) {
        book.quantity += item.amount;
        await book.save();
      }
    }
  }

  borrowToReturn.returned = true;
  borrowToReturn.returnedDate = new Date();

  return await borrowToReturn.save();
};

const getAllByUser = async (user_data) => {
  return await Borrow.find({ user: user_data._id, returned: false }).populate({
    path: "items.book",
    model: "Books",
    populate: {
      path: "authors",
      model: "Authors",
    },
  });
};

const getAllByUserWithReturned = async (user_data) => {
  return await Borrow.find({ user: user_data._id }).populate({
    path: "items.book",
    model: "Books",
    populate: {
      path: "authors",
      model: "Authors",
    },
  });
};

module.exports = {
  create,
  getAllByUser,
  getAllByUserWithReturned,
  returnBorrow,
};
