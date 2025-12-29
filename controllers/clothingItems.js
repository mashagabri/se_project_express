const ClothingItem = require("../models/clothingItem");
const checkValidity = require("../utils/checkValidity");
const { NotFoundError } = require("../errors/not-found-err");
const { AccessError } = require("../errors/access-error");
const { BadRequestError } = require("../errors/bad-request");

exports.getClothingItems = async (req, res) => {
  const clothingItems = await ClothingItem.find();
  return res.json(clothingItems);
};

exports.deleteClothingItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const currentUserId = req.user._id;
    checkValidity(itemId, "Item id is not valid");
    await ClothingItem.findById(itemId)
      .orFail()
      .then((item) => {
        if (currentUserId !== String(item.owner._id)) {
          throw new AccessError();
        }
        return item
          .deleteOne()
          .then(() =>
            res.status(200).send({ message: "Successfully deleted" })
          );
      })
      .catch((err) => {
        // next(err);
        throw new NotFoundError();
      });
  } catch (err) {
    next(err);
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
    next(new BadRequestError());

    // if (err.name === "ValidationError") {
    //   error.statusCode = BAD_REQUEST;
    // } else {
    //   error.statusCode = INTERNAL_SERVER_ERROR;
    // }
    // throw error;
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
    next(err);
  }
};

exports.unlikeClothingItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    checkValidity(itemId, "Item id is not valid");
    await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError();
    });
    const updatedLike = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // remove _id to the array if it's not there yet
      { new: true }
    );
    return res.status(200).send(updatedLike);
  } catch (err) {
    next(err);
  }
};
