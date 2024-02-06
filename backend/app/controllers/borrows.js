const services = require("../services/borrows");

const create = async (req, res) => {
  const order = req.body;

  try {
    const response = await services.create(order, req.user_data);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const returnBorrow = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await services.returnBorrow(id, req.user_data);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllByUser = async (req, res) => {
  try {
    const orders = await services.getAllByUser(req.user_data);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPopularAuthors = async (req, res) => {
  try {
    const orders = await services.getPopularAuthors();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPopularBooks = async (req, res) => {
  try {
    const orders = await services.getPopularBooks();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  returnBorrow,
  getAllByUser,
  getPopularAuthors,
  getPopularBooks,
};
