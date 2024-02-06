const service = require("../services/users");
const jwt = require("jsonwebtoken");

const create = async (req, res) => {
  try {
    const user = await service.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });
    res.status(201).json({
      token,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const response = await service.login(req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const me = async (req, res, next) => {
  return res.status(200).json(req.user_data);
};

module.exports = {
  create,
  login,
  me,
};
