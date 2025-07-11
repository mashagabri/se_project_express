const express = require("express");
const clothingItemsController = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", clothingItemsController.getClothingItems);

router.delete("/:itemId", clothingItemsController.deleteClothingItem);

router.post("/", clothingItemsController.createNewItem);

module.exports = router;
