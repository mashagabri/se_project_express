const express = require("express");
const clothingItemsController = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", clothingItemsController.getClothingItems);

router.delete("/:itemId", clothingItemsController.deleteClothingItem);

router.post("/", clothingItemsController.createNewItem);

router.put("/:itemId/likes", clothingItemsController.likeClothingItem);

router.delete("/:itemId/likes", clothingItemsController.unlikeClothingItem);

module.exports = router;
