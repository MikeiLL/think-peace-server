const mongoose = require("mongoose");

const WishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const Wish = mongoose.model("Wish", WishSchema);

module.exports = { Wish };
