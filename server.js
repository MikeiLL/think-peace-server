require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Wish } = require("./models/wish");

const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hi, I am Think-Peace's server" });
});

app.get("/wishes", async (req, res) => {
  const allWishes = await Wish.find();
  return res.status(200).json(allWishes);
});

app.post("/wish", async (req, res) => {
  const newWish = new Wish({ ...req.body });
  const insertedWish = await newWish.save();
  return res.status(201).json(insertedWish);
});

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(3000, () =>
      console.log(`Server started on port ${port} and connected to DB`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
