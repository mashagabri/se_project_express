const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  AUTHORIZATION_DENIED,
  AUTHORIZATION_DENIED_MESSAGE,
  INVALID_TOKEN,
} = require("../utils/errors");

module.exports = function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(AUTHORIZATION_DENIED)
      .json({ message: AUTHORIZATION_DENIED_MESSAGE });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(AUTHORIZATION_DENIED).json({ message: INVALID_TOKEN });
  }
};
