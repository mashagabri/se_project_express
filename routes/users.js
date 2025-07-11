const express = require("express");
const userController = require("../controllers/users");

const router = express.Router();

router.get("/", userController.getUsers);

router.get("/:userId", userController.getUser);

router.post("/", userController.createUser);

module.exports = router;
