const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

const User = require("../models/users");

const authorization = asynchandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      const user = await User.findOne({ _id: decoded.id });

      if (user == null) {
        return res.status(401).json({
          message: "Not Authorized: User not found",
        });
      }

      req.user_data = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Authorized: No Token Specified",
    });
  }
});

module.exports = authorization;
