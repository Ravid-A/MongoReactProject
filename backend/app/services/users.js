const ObjectId = require("mongoose").Types.ObjectId;
const bcryptjs = require("bcryptjs");

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

module.exports = {
  create,
  login,
};
