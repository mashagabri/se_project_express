const mongoose = require("mongoose");
const { BAD_REQUEST } = require("../utils/errors");

module.exports = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(message);
    error.statusCode = BAD_REQUEST;
    throw error;
  }
};
