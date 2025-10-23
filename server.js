require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Wish } = require("./models/wish");
const {getGeocode} = require("./helper/getGeocode");
const {defaultWish} = require("./helper/defaultWish");
const querystring = require('node:querystring');

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
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded post data
app.use(express.json()); // for parsing application/json post data

app.get("/", (req, res) => {
  return res.json({ message: "Hi, I am Think-Peace's server" });
});

app.get("/wishes", async (req, res) => {
  let result;
  if ((req.query.pin) && mongoose.Types.ObjectId.isValid(req.query.pin)) {
    await Wish.find({_id: req.query.pin}).then((wishes) => {
      result = wishes[0] || {};
    });
  } else {
    result = await Wish.find({});
    /* result.unshift(defaultWish()); */
  }
  console.log(result[0]);
  console.log(result[3]);
  return res.status(200).json(result);
});

app.post("/add-wish", async (req, res) => {
  let fromCoordinates;
  let toCoordinates;
  try {
    // Get coordinates from the address.
    // getGeocode doesn't always find a match, for example, for
    // Guitar, Spain. In which case, the empty strings are used.
    // (Below in creation of the data object)
    fromCoordinates = await getGeocode(req.body.from.label);
    toCoordinates = await getGeocode(req.body.to.label);
  } catch (error) {
    console.log(error);
    // Return a basic request error.
    return res.status(400).json({error: "Is that a valid address?"});
  }

  const { hashTag } = req.body;

  const data = {
    from: {
      fullAddress: fromCoordinates.fullAddress
        ? fromCoordinates.fullAddress
        : req.body.from.label || ''+req.body.from,
      city: fromCoordinates?.city || '',
      country: fromCoordinates?.country || '',
      countryCode: fromCoordinates?.countryCode || '',
      position: {
        lat: fromCoordinates?.lat || '',
        lng: fromCoordinates?.lng || '',
      },
    },
    to: {
      fullAddress: toCoordinates.fullAddress
        ? toCoordinates.fullAddress
        : req.body.to.label || ''+req.body.to,
      city: toCoordinates?.city || '',
      country: toCoordinates?.country || '',
      countryCode: toCoordinates?.countryCode || '',
      position: {
        lat: toCoordinates?.lat || '',
        lng: toCoordinates?.lng || '',
      },
    },
    hashTag,
  };

  console.log("data");
  console.log(data);

  const newWish = new Wish(data);
  const insertedWish = await newWish.save();

  if (!insertedWish) return res.status(400).json({ error: "Error recording wish." });


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
