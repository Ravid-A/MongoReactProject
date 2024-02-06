const services = require("../services/statistics");

const getStatistics = async (req, res) => {
  try {
    if (!req.user_data.privilage) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const statistics = await services.getStatistics();
    res.json(statistics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPopularAuthors = async (req, res) => {
  try {
    const popularAuthors = await services.getPopularAuthors();
    res.json(popularAuthors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPopularBooks = async (req, res) => {
  try {
    const popularBooks = await services.getPopularBooks();
    res.json(popularBooks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStatistics,
  getPopularAuthors,
  getPopularBooks,
};
