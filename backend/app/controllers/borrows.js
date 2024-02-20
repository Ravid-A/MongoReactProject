const services = require("../services/borrows");

const create = async (req, res) => {
  const order = req.body;

  try {
    const response = await services.create(order, req.user_data);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
      book: error.book,
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
  const all = req.params.all == 1;
  try {
    let borrows = null;

    if (all) {
      borrows = await services.getAllByUserWithReturned(req.user_data);
    } else {
      borrows = await services.getAllByUser(req.user_data);
    }

    res.json(borrows);
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
};
