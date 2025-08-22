const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middlewares/auth");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");
const clothingItemsController = require("./controllers/clothingItems");
const errorMiddleware = require("./middlewares/error.middleware");
const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", indexRoutes);
app.get("/items", clothingItemsController.getClothingItems);
app.use(auth);
app.use("/users", userRoutes);
app.use("/items", itemsRoutes);
app.use((req, res) => res.status(NOT_FOUND).send({ message: "Undefined URL" }));
app.use(errorMiddleware);

try {
  mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
} catch (err) {
  console.log(`Error database: ${err.message}`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
