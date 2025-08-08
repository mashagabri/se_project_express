const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require("../utils/errors");

module.exports = (err, _req, res, _next) => {
  console.log(
    `Error ${err.name} with the message ${err.message} has occurred while executing the code`
  );
  const errorsArray = [BAD_REQUEST, NOT_FOUND, CONFLICT_ERROR];
  if (err.statusCode && errorsArray.includes(err.statusCode)) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: SERVER_ERROR_MESSAGE });
};
