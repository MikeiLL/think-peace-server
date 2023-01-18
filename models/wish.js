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

const WishSchema = new mongoose.Schema(
  {
    from: BaseSchema,
    to: BaseSchema,
    hashTag: { type: String, required: true },
  },
  { timestamps: true }
);

WishSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Wish = mongoose.model("Wish", WishSchema);

Wish.createIndexes();

module.exports = { Wish };
