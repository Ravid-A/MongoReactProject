const countries = require("../helpers/countries");

const getCountries = async (req, res) => {
  return res.status(200).json({
    countries,
  });
};

module.exports = {
  getCountries,
};
