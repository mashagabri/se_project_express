const User = require("../models/user");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const { BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

exports.getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("User ID is not valid");
    error.statusCode = BAD_REQUEST;
    throw error;
  }
  const user = await User.findById(userId).orFail(() => {
    const error = new Error("User ID not found");
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
