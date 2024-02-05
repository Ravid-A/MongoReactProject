const genres = require("../helpers/genres");

const getGenres = async (req, res) => {
  return res.status(200).json({
    genres,
  });
};

module.exports = {
  getGenres,
};
