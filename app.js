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
    _id: "6870c57c14671a99529a3fd7",
  };
  next();
});

app.use("/users", userRoutes);
app.use("/items", itemsRoutes);

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
