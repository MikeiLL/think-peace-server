require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Wish } = require("./models/wish");

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hi, I am Think-Peace's server" });
});

app.get("/wishes", async (req, res) => {
  const allWishes = await Wish.find({});
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
    app.listen(port, () =>
      console.log(`Server started on port ${port} and connected to DB`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
