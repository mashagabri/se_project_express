const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middlewares/auth");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");
const clothingItemsController = require("./controllers/clothingItems");
const errorMiddleware = require("./middlewares/error.middleware");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errors } = require("celebrate");
require("dotenv").config();

const { PORT = 3001 } = process.env;

const app = express();
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://www.mariazackwtwr.jumpingcrab.com"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(requestLogger);
// app.use(
//   cors()
//   // cors({
//   //   origin: "https://www.mariazackwtwr.jumpingcrab.com",
//   //   credentials: true,
//   // })
// );
app.use(express.json());
app.use("/", indexRoutes);
app.get("/items", clothingItemsController.getClothingItems);
app.use(auth);
app.use("/users", userRoutes);
app.use("/items", itemsRoutes);
app.use(errorLogger);
app.use(errors());
console.log("Error");
app.use(errorMiddleware);
app.use((err, req, res, next) => {
  console.error(err);
  return res
    .status(500)
    .send({ message: "An error has occurred on the server" });
});

try {
  mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
} catch (err) {
  console.log(`Error database: ${err.message}`);
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
