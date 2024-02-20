const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Authenticate = async (user, password) => {
  if (user == null) {
    return {
      status: 400,
      data: {
        error: true,
        message: "Account not found",
        type: "account_not_found",
      },
    };
  }

  try {
    if (await bcryptjs.compare(password, user.password)) {
      const access_token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
        expiresIn: "30d",
      });

      return {
        status: 200,
        data: {
          message: "OK",
          token: access_token,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          error: true,
          message: "Incorrect password",
        },
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: {
        message: error.message,
        error: true,
      },
    };
  }
};

module.exports = Authenticate;
