const mongoose = require("mongoose");
const { BadRequestError } = require("../errors/bad-request");

// check type ID  (24 symbols)
module.exports = (id, message = null) => {
  // is checking that there are 24 symbols(only letters and numbers)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(message);
  }
};
