const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require("../utils/errors");

module.exports = (err, _req, res, _next) => {
  console.log(
    `Error ${err.name} with the message ${err.message} has occurred while executing the code`
  );
  const errorsArray = [BAD_REQUEST, NOT_FOUND];
  if (err.statusCode && errorsArray.includes(err.statusCode)) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: SERVER_ERROR_MESSAGE });

  // if (err.name === "BAD_REQUEST") {
  //   return res.status(BAD_REQUEST).send({ message: err.message });
  // } else if (err.name === "NOT_FOUND") {
  //   return res.status(NOT_FOUND).send({ message: err.message });
  // } else if (err.name === "INTERNAL_SERVER_ERROR") {
  //   return res
  //     .status(INTERNAL_SERVER_ERROR)
  //     .send({ message: err.message });
  // } else if (err.name === "SERVER_ERROR_MESSAGE") {
  //   return res
  //     .status(SERVER_ERROR_MESSAGE)
  //     .send({ message: err.message });
  // } else {
  //   res.status(500).json({ error: err.message, errorName: err.name });
  // }
};
