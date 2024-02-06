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

const getAll = async (req, res) => {
  try {
    if (!req.user_data.privilage)
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });

    const users = await service.getAll(req.user_data);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const me = async (req, res, next) => {
  return res.status(200).json(req.user_data);
};

const updateAdmin = async (req, res) => {
  const id = req.params.id;
  const { privilage } = req.body;

  try {
    if (!req.user_data.privilage)
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });

    const user = await service.updateAdmin(req.user_data, id, privilage);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    if (!req.user_data.privilage)
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });

    const user = await service.deleteUser(req.user_data, id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  login,
  getAll,
  me,
  updateAdmin,
  deleteUser,
};
