const services = require("../services/orders");

const create = async (req, res) => {
  const order = req.body;

  try {
    const response = await services.create(order);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await services.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMaxTotalInYearRange = async (req, res) => {
  const { startYear, endYear } = req.query;
  try {
    const orders = await services.getMaxTotalInYearRange(startYear, endYear);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTop3PopularGenres = async (req, res) => {
  const { startYear, endYear } = req.query;
  try {
    const orders = await services.getTop3PopularGenres(startYear, endYear);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfitInRange = async (req, res) => {
  const { startYear, endYear } = req.query;
  try {
    const orders = await services.getProfitInRange(startYear, endYear);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTop5PopularAuthors = async (req, res) => {
  const { startYear, endYear } = req.query;
  try {
    const orders = await services.getTop5PopularAuthors(startYear, endYear);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getMaxTotalInYearRange,
  getTop3PopularGenres,
  getProfitInRange,
  getTop5PopularAuthors,
};
