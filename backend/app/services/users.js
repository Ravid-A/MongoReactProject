const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Authenticate = require("../utilities/Authenticate");

const User = require("../models/users");

const create = async (user_data) => {
  const { username, email, password } = user_data;

  if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) === null) {
    const error = new Error("Invalid Email Format");
    error.status = 400;
    throw error;
  }

  if (
    password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ) === null
  ) {
    const error = new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    );
    error.status = 400;
    throw error;
  }

  if (await isEmailTaken(email)) {
    const error = new Error("Email already taken");
    error.status = 400;
    throw error;
  }

  if (await isUsernameTaken(username)) {
    const error = new Error("Username already taken");
    error.status = 400;
    throw error;
  }

  const hash_password = await bcryptjs.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hash_password,
  });

  return await user.save();
};

const isEmailTaken = async (email) => {
  return !!(await User.findOne({ email }));
};

const isUsernameTaken = async (username) => {
  return !!(await User.findOne({ username }));
};

const login = async (user_data) => {
  const { identifier, password } = user_data;

  let user = await User.findOne({ email: identifier });
  let response = await Authenticate(user, password);

  if (response.data.type === "account_not_found") {
    user = await User.findOne({ username: identifier });
    response = await Authenticate(user, password);
  }

  return response;
};

const getAll = async (user_data) => {
  return (await User.find()).filter(
    (user) => user._id.toString() != user_data._id.toString()
  );
};

const update = async (user_data, new_data) => {
  const user = await User.findById(user_data._id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (new_data.email && new_data.email !== user.email) {
    if (await isEmailTaken(new_data.email)) {
      const error = new Error("Email already taken");
      error.status = 400;
      throw error;
    }

    user.email = new_data.email;
  }

  if (new_data.username && new_data.username !== user.username) {
    if (await isUsernameTaken(new_data.username)) {
      const error = new Error("Username already taken");
      error.status = 400;
      throw error;
    }

    user.username = new_data.username;
  }

  await user.save();

  return "User updated successfully";
};

const updatePassword = async (user_data, new_data) => {
  const user = await User.findById(user_data._id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (!(await bcryptjs.compare(new_data.old_password, user.password))) {
    const error = new Error("Incorrect password");
    error.status = 400;
    throw error;
  }

  if (await bcryptjs.compare(new_data.new_password, user.password)) {
    const error = new Error(
      "New password cannot be the same as the old password"
    );
    error.status = 400;
    throw error;
  }

  if (
    new_data.new_password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ) === null
  ) {
    const error = new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    );

    error.status = 400;
    throw error;
  }

  user.password = await bcryptjs.hash(new_data.new_password, 10);
  await user.save();
  return "Password updated successfully";
};

const updateAdmin = async (user_data, id, privilage) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (user.privilage === privilage) {
    const error = new Error("User already has the same privilage");
    error.status = 400;
    throw error;
  }

  if (user.privilage >= user_data.privilage) {
    const error = new Error("You are not authorized to perform this action");
    error.status = 403;
    throw error;
  }

  user.privilage = privilage;
  return await user.save();
};

const deleteUser = async (user_data, id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (user.privilage >= user_data.privilage) {
    const error = new Error("You are not authorized to perform this action");
    error.status = 403;
    throw error;
  }

  return await User.findByIdAndDelete(id);
};

module.exports = {
  create,
  login,
  getAll,
  update,
  updatePassword,
  updateAdmin,
  deleteUser,
};
