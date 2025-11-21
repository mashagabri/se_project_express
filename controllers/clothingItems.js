const ClothingItem = require("../models/clothingItem");
const asyncHandler = require("../utils/asyncHandler");
const checkValidity = require("../utils/checkValidity");
const {
  NOT_FOUND,
  BAD_REQUEST,
  ACCESS_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

exports.getClothingItems = asyncHandler(async (req, res) => {
  const clothingItems = await ClothingItem.find();
  return res.json(clothingItems);
});

exports.deleteClothingItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;
  checkValidity(itemId, "Item id is not valid");
  await ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      console.log(currentUserId);
      console.log(item.owner._id);
      if (currentUserId !== String(item.owner._id)) {
        return res.status(ACCESS_ERROR).send({ message: "Acces denied" });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Successfully deleted" }));
    })
    .catch(() => {
      const error = new Error("Not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
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
    if (err.name === "ValidationError") {
      error.statusCode = BAD_REQUEST;
    } else {
      error.statusCode = INTERNAL_SERVER_ERROR;
    }
    throw error;
  }
});

exports.likeClothingItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  checkValidity(itemId, "Item id is not valid");
  await ClothingItem.findById(itemId).orFail(() => {
    const error = new Error("Item not found");
    error.statusCode = NOT_FOUND;
    throw error;
  });
  const updatedLike = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  );
  return res.status(200).send(updatedLike);
});

exports.unlikeClothingItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  checkValidity(itemId, "Item id is not valid");
  console.log(req.user._id);
  await ClothingItem.findById(itemId).orFail(() => {
    const error = new Error("Item not found");
    error.statusCode = NOT_FOUND;
    throw error;
  });
  const updatedLike = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id to the array if it's not there yet
    { new: true }
  );
  return res.status(200).send(updatedLike);
});
