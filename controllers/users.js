const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const checkValidity = require("../utils/checkValidity");
const AuthorizationDeniedError = require("../errors/authorization-denied");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-error");

exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;

  try {
    checkValidity(userId, "User ID is not valid");
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError();
    });
    res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;
    checkValidity(userId, "User ID is not valid");
    const user = await User.findByIdAndUpdate(
      {
        _id: req.user._id,
      },
      { name, avatar },
      { new: true, runValidators: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          return updatedUser;
        }

        throw new NotFoundError();
      })
      .catch((err) => {
        next(err);
      });
    res.json({ name: user.name, avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      throw new ConflictError();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, avatar, email, password: hashedPassword });
    await user.save();
    res
      .status(201)
      .json({ name: user.name, email: user.email, avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError();
    }
  } catch (err) {
    next(err);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email or password") {
        next(new AuthorizationDeniedError());
      }
      next(err);
    });
};
