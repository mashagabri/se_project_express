const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports = function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
