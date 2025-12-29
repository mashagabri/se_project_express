const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().required().length(24),
  }),
});

module.exports = { validateURL, validateId };
