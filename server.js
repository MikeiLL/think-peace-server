require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Wish } = require("./models/wish");
const { getGeocode } = require("./helper/getGeocode");

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

app.post("/add-wish", async (req, res) => {
  const fromCoordinates = await getGeocode(req.body.from);
  const toCoordinates = await getGeocode(req.body.to);

  const data = {
    from: {
      fullAdress: fromCoordinates?.fullAdress,
      city: fromCoordinates?.city,
      country: fromCoordinates?.country,
      countryCode: fromCoordinates?.countryCode,
      position: {
        lat: fromCoordinates?.lat,
        lng: fromCoordinates?.lng,
      },
    },
    to: {
      fullAdress: toCoordinates?.fullAdress,
      city: toCoordinates?.city,
      country: toCoordinates?.country,
      countryCode: toCoordinates?.countryCode,
      position: {
        lat: toCoordinates?.lat,
        lng: toCoordinates?.lng,
      },
    },
  };

  const newWish = new Wish(data);
  const insertedWish = await newWish.save();

  if (!insertedWish) return res.status(200).json({ error: "Invalid addres" });

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
