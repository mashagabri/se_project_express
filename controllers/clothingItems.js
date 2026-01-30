const ClothingItem = require("../models/clothingItem");
const checkValidity = require("../utils/checkValidity");
const NotFoundError = require("../errors/not-found-err");
const AccessError = require("../errors/access-error");
const BadRequestError = require("../errors/bad-request");

exports.getClothingItems = async (req, res) => {
  const clothingItems = await ClothingItem.find();
  return res.json(clothingItems);
};

exports.deleteClothingItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const currentUserId = req.user._id;
    checkValidity(itemId, "Item id is not valid");
    const item = await ClothingItem.findById(itemId).orFail();
    if (currentUserId !== String(item.owner._id)) {
      throw new AccessError();
    }
    await item.deleteOne();
    return res.status(200).send({ message: "Successfully deleted" });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError());
    }
    return next(err);
  }
};

exports.createNewItem = async (req, res, next) => {
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
    return next(new BadRequestError());
  }
};

exports.likeClothingItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    checkValidity(itemId, "Item id is not valid");
    await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError();
    });
    const updatedLike = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    );
    return res.status(200).send(updatedLike);
  } catch (err) {
    return next(err);
  }
};

exports.unlikeClothingItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    checkValidity(itemId, "Item id is not valid");
    await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError();
    });
    const updatedLike = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } }, // remove _id to the array if it's not there yet
      { new: true }
    );
    return res.status(200).send(updatedLike);
  } catch (err) {
    return next(err);
  }
};
