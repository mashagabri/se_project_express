const express = require("express");
const { celebrate, Joi } = require("celebrate");
const { login, createUser } = require("../controllers/users");
const { validateURL } = require("../middlewares/validation");

const router = express.Router();

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required().messages({
        "string.empty": 'The "email" field must be filled in',
        "string.email": 'The "email" field is not correct',
      }),
      password: Joi.string().required().messages({
        "string.empty": 'The "password" field must be filled in',
      }),
    }),
  }),
  login
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      avatar: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      email: Joi.string().email().required().messages({
        "string.empty": 'The "email" field must be filled in',
        "string.email": 'The "email" field is not correct',
      }),
      password: Joi.string().required().messages({
        "string.empty": 'The "password" field must be filled in',
      }),
    }),
  }),
  createUser
);

module.exports = router;
