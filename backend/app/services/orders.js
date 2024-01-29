const Order = require("../models/orders");
const Book = require("../models/books");
const Author = require("../models/authors");

const checkBooksQuantity = async (items, books) => {
  for (item of items) {
    for (book of books) {
      if (item.book === book._id.toString()) {
        if (item.amount > book.quantity) {
          throw new Error(
            `Not enough books in stock to buy the book '${book._id}'`
          );
        }
      }
    }
  }
};

const updateBooksQuantity = async (items, books) => {
  for (item of items) {
    if (!item.amount)
      throw new Error(`Amount for item '${item.book}' is required`);

    for (book of books) {
      if (item.book === book._id.toString()) {
        book.quantity -= item.amount;
        await book.save();
      }
    }
  }
};

const create = async (order) => {
  const items = [];

  if (!order.items) {
    //Case of 1 item
    const item = {
      book: order.book,
      amount: order.amount,
    };

    items.push(item);
  } else {
    items = order.items;
  }

  const books = await Book.find({
    _id: { $in: items.map((item) => item.book) },
  });

  await checkBooksQuantity(items, books);
  await updateBooksQuantity(items, books);

  const totalPrice = books.reduce((total, book) => {
    const item = items.find((item) => item.book === book._id.toString());
    return total + item.amount * book.price;
  }, 0);

  const newOrder = new Order({
    items: items.map((item) => {
      return { book: item.book, amount: item.amount };
    }),
    totalPrice,
  });
  return await newOrder.save();
};

const getAll = async () => {
  return await Order.find().populate({
    path: "items.book",
    model: "Books",
    populate: {
      path: "authors",
      model: "Authors",
    },
  });
};

const getMaxTotalInYearRange = async (startYear, endYear) => {
  const orders = await Order.find({
    date: { $gte: new Date(startYear), $lte: new Date(endYear) },
  });

  // Return the order with the highest total price
  return orders
    .reduce((maxOrder, order) => {
      if (order.totalPrice > maxOrder.totalPrice) return order;
      return maxOrder;
    })
    .populate({
      path: "items.book",
      model: "Books",
      populate: {
        path: "authors",
        model: "Authors",
      },
    });
};

const getTop3PopularGenres = async (startYear, endYear) => {
  const genres = await Order.aggregate([
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
      $unwind: "$bookDetails.genres",
    },
    {
      $group: {
        _id: "$bookDetails.genres",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  return genres.map((genre) => {
    return genre._id;
  });
};

const getProfitInRange = async (startYear, endYear) => {
  const orders = await Order.find({
    date: { $gte: new Date(startYear), $lte: new Date(endYear) },
  });

  const profit = orders.reduce((total, order) => {
    return total + order.totalPrice;
  }, 0);

  return profit;
};

const getTop5PopularAuthors = async (startYear, endYear) => {
  const authors = await Order.aggregate([
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
      $group: {
        _id: "$bookDetails.authors",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const authorsDetails = [];

  for (author of authors) {
    const authorWithDetails = await Author.findById(author._id);

    authorsDetails.push({
      ...authorWithDetails.toObject(),
      count: author.count,
    });
  }

  return authorsDetails;
};

module.exports = {
  create,
  getAll,
  getMaxTotalInYearRange,
  getTop3PopularGenres,
  getProfitInRange,
  getTop5PopularAuthors,
};
