const ClothingItems = require("../models/clothingItems");
const asyncHandler = require("../utils/asyncHandler");
const { NOT_FOUND, BAD_REQUEST } = require("../utils/errors");

exports.getClothingItems = asyncHandler(async (req, res, next) => {
  const clothingItems = await ClothingItems.find();
  return res.json(clothingItems);
});

exports.deleteClothingItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  const item = await ClothingItems.findByIdAndDelete(itemId);
  if (!item) {
    return res.sendStatus(404);
  }
  return res.status(200).end();
});

exports.createNewItem = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  try {
    const newItem = await ClothingItems.create({
      owner,
      name,
      weather,
      imageUrl,
    });
    return res.status(201).json(newItem);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = BAD_REQUEST;
    throw error;
  }
});
