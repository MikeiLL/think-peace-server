const mongoose = require("mongoose");

const BaseSchema = new mongoose.Schema({
  endpoint: {type: String, unique: true},
    keys: {
        p256dh: {type: String},
        auth: {type: String},
    },
});

const PushSubSchema = new mongoose.Schema(
  {
    endpoint: BaseSchema,
    keys: { p256dh: String, auth: String },
  },
  {timestamps: true},
);

/* PushSubSchema.createIndex( {endpoint}, { unique: true } ) */

const PushSub = mongoose.model("PushSub", PushSubSchema);

PushSub.createIndexes();

module.exports = { PushSub };
