const User = require("../models/users");
const asyncHandler = require("../utils/asyncHandler");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).orFail(() => {
    const error = new Error("Item ID not found");
    error.statusCode = NOT_FOUND;
    throw error;
  });
  res.json(user);
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, avatar } = req.body;
  try {
    const newUser = await User.create({ name, avatar });
    res.status(201).json(newUser);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = BAD_REQUEST;
    throw error;
  }
});
