const ClothingItem = require("../models/clothingItem");
const asyncHandler = require("../utils/asyncHandler");
const checkValidity = require("../utils/checkValidity");
const { NOT_FOUND, BAD_REQUEST, ACCESS_ERROR } = require("../utils/errors");

exports.getClothingItems = asyncHandler(async (req, res, next) => {
  const clothingItems = await ClothingItem.find();
  return res.json(clothingItems);
});

exports.deleteClothingItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  const currentUserId = req.user._id;
  checkValidity(itemId, "Item id is not valid");
  const item = await ClothingItem.findByIdAndDelete(itemId);
  if (!item) {
    return res.sendStatus(NOT_FOUND);
  }
  if (item.owner._id !== currentUserId) {
    return res.sendStatus(ACCESS_ERROR);
  }
  return res.status(200).end();
});

exports.createNewItem = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  try {
    const newItem = await ClothingItem.create({
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

exports.likeClothingItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  checkValidity(itemId, "Item id is not valid");
  const item = await ClothingItem.findById(itemId).orFail(() => {
    const error = new Error("Item not found");
    error.statusCode = NOT_FOUND;
    throw error;
  });
  await ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  );
  return res.status(200).end();
});

exports.unlikeClothingItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  checkValidity(itemId, "Item id is not valid");
  const item = await ClothingItem.findById(itemId).orFail(() => {
    const error = new Error("Item not found");
    error.statusCode = NOT_FOUND;
    throw error;
  });
  await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id to the array if it's not there yet
    { new: true }
  );
  return res.status(200).end();
});
