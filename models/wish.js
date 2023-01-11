const mongoose = require("mongoose");

const BaseSchema = new mongoose.Schema({
  fullAdress: { type: String, required: true },
  city: { type: String, required: false },
  country: { type: String, required: false },
  countryCode: { type: String, required: false },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const WishSchema = new mongoose.Schema({
  from: BaseSchema,
  to: BaseSchema,
  hashTag: { type: String, required: true },
});

const Wish = mongoose.model("Wish", WishSchema);

module.exports = { Wish };
