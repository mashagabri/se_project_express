const express = require("express");
const { celebrate, Joi } = require("celebrate");
const clothingItemsController = require("../controllers/clothingItems");
const { validateURL, validateId } = require("../middlewares/validation");

const router = express.Router();

// router.get("/", clothingItemsController.getClothingItems);
router.delete(
  "/:itemId",
  validateId,
  clothingItemsController.deleteClothingItem
);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      weather: Joi.string().valid("hot", "warm", "cold").required().messages({
        "string.empty": 'The "weather" field must be filled in',
      }),
    }),
  }),
  clothingItemsController.createNewItem
);

router.put(
  "/:itemId/likes",
  validateId,
  clothingItemsController.likeClothingItem
);

router.delete(
  "/:itemId/likes",
  validateId,
  clothingItemsController.unlikeClothingItem
);

module.exports = router;
