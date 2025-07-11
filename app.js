const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");

const errorMiddleware = require("./middlewares/error.middleware");

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "685e58f49451bce59de9d54d",
  };
  next();
});

app.use("/users", userRoutes);
app.use("/items", itemsRoutes);

app.use(errorMiddleware);

try {
  mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
} catch (err) {
  console.log(`Error database: ${err.message}`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
