const mongoose = require("mongoose");

const BaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const WishSchema = new mongoose.Schema({
  from: BaseSchema,
  to: BaseSchema,
});

const Wish = mongoose.model("Wish", WishSchema);

module.exports = { Wish };
