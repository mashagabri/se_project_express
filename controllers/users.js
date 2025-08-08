const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const asyncHandler = require("../utils/asyncHandler");
const { NOT_FOUND, CONFLICT_ERROR, BAD_REQUEST } = require("../utils/errors");
const checkValidity = require("../utils/checkValidity");
const bcrypt = require("bcrypt");
const { handleMongoError } = require("../utils/handleErrors");

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  checkValidity(userId, "User ID is not valid");

  const user = await User.findById(userId).orFail(() => {
    const error = new Error("User ID not found");
    error.statusCode = NOT_FOUND;
    throw error;
  });
  res.json({ name: user.name, avatar: user.avatar, email: user.email });
});

exports.updateCurrentUser = asyncHandler(async (req, res) => {
  let { name, avatar } = req.body;
  const userId = req.user._id;
  checkValidity(userId, "User ID is not valid");
  const user = await User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    { name: name, avatar: avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        return updatedUser;
      }
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .catch((err) => {
      handleMongoError(err);
    });
  res.json({ name: user.name, email: user.email, avatar: user.avatar });
});

exports.createUser = asyncHandler(async (req, res) => {
  let { name, avatar, email, password } = req.body;
  if (await User.findOne({ email: email })) {
    const error = new Error("Conflict email error");
    error.statusCode = CONFLICT_ERROR;
    throw error;
  }
  try {
    password = await bcrypt.hash(password, 10);
    const user = new User({ name, avatar, email, password });
    await user.save();
    res
      .status(201)
      .json({ name: user.name, email: user.email, avatar: user.avatar });
  } catch (err) {
    handleMongoError(err);
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Please enter necessary information");
    error.statusCode = BAD_REQUEST;
    throw error;
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
});
