const mongoose = require("mongoose");

const PushSubSchema = new mongoose.Schema(
  {
    endpoint: {type: String, unique: true},
    keys: {
        p256dh: {type: String},
        auth: {type: String},
    },
  },
  {timestamps: true},
);

const PushSub = mongoose.model("PushSub", PushSubSchema);

PushSub.createIndexes();

module.exports = { PushSub };
