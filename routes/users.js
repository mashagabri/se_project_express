const express = require("express");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const router = express.Router();

// router.get("/", userController.getUsers);

router.get("/me", getCurrentUser);

router.patch("/me", updateCurrentUser);

// router.post("/", userController.createUser);

module.exports = router;
