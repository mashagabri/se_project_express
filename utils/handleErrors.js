const {
  BAD_REQUEST,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("./errors");

module.exports.handleMongoError = (err) => {
  const error = new Error(err.message);
  if (err.code === 11000) {
    error.statusCode = CONFLICT_ERROR;
  } else if (err.name === "ValidationError") {
    error.statusCode = BAD_REQUEST;
  } else {
    error.statusCode = INTERNAL_SERVER_ERROR;
  }
  throw error;
};
