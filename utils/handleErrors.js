const { BAD_REQUEST, CONFLICT_ERROR } = require("../utils/errors");

module.exports.handleMongoError = (err) => {
  // TODO other err.message
  const error = new Error(err.message);
  if (err.code === 11000) {
    error.statusCode = CONFLICT_ERROR;
  } else {
    error.statusCode = BAD_REQUEST;
  }
  throw error;
};
