const mongoose = require("mongoose");
const { BAD_REQUEST } = require("./errors");

// check type ID  (24 symbols)
module.exports = (id, message) => {
  // is checking that there are 24 symbols(only letters and numbers)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(message);
    error.statusCode = BAD_REQUEST;
    throw error;
  }
};
