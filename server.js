require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Wish } = require("./models/wish");
const { PushSub } = require("./models/pushsub");
const {getGeocode} = require("./helper/getGeocode");
const {defaultWish} = require("./helper/defaultWish");
const querystring = require('node:querystring');

const port = process.env.PORT || 4000;

const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}
webPush.setVapidDetails(
  'mailto:mike@mzoo.org',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// This is the same output of calling JSON.stringify on a PushSubscription
/* const pushSubscription = {
  endpoint: '.....',
  keys: {
    auth: '.....',
    p256dh: '.....'
  }
};

webPush.sendNotification(pushSubscription, 'Your Push Payload Text'); */


module.exports = function (app, route) {
  app.get(route + "vapidPublicKey", function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  app.post(route + "register", function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  app.post(route + "sendNotification", function (req, res) {
    const subscription = req.body.subscription;
    const payload = null;
    const options = {
      TTL: req.body.ttl,
    };

    setTimeout(function () {
      webPush
        .sendNotification(subscription, payload, options)
        .then(function () {
          res.sendStatus(201);
        })
        .catch(function (error) {
          res.sendStatus(500);
          console.log(error);
        });
    }, req.body.delay * 1000);
  });
};

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
const path = require('path');
app.get("/scripts/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.js'));
});

app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.join(__dirname, 'service-worker.js'));
});

app.get("/vapidPublicKey", (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/register",  async (req, res) => {
  console.log(req.body);
  console.log(req.body.subscription);
  const sub = req.body.subscription;
  try {
    const newPushSubscription = new PushSub({endpoint: sub.endpoint, keys: sub.keys});
    await newPushSubscription.save();
  } catch (e) {
    console.error(e);
    //TODO what kind of error did we actually get? (eg MongoServerError)
  }
  webPush.sendNotification(sub, JSON.stringify({"title": "You are subscribed"}))
    .catch(err => console.log(err));

  res.status(201).json({});
});

app.post("/sendNotification", (req, res) => {
  webPush.sendNotification(req.body.subscription, 'Your Push Payload Text');
});

app.post('/removeSubscription', async (request, response) => {
  const sub = request.body;
  await PushSub.findOneAndDelete({endpoint: sub.subscription_endpoint}).exec();
  response.sendStatus(204);
});

app.get("/wishes", async (req, res) => {
  let result;
  if ((req.query.pin) && mongoose.Types.ObjectId.isValid(req.query.pin)) {
    await Wish.find({_id: req.query.pin}).then((wishes) => {
      result = wishes[0] || {};
    });
  } else {
    result = await Wish.find({});
    result.unshift(defaultWish());
  }
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
    console.error(error);
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

  if (!insertedWish) return res.status(400).json({error: "Error recording wish."});
  res.status(201).json(insertedWish);
  // Broadcast notifications here.
  const subs = await PushSub.find({});
  for (let sub of subs) {
    let subscription = {
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth
      },
      endpoint: sub.endpoint,
    };
    try {
      await webPush.sendNotification(subscription, JSON.stringify({
        "title": `New ThinkPeace Wish`,
        "body": `${data.hashTag} from ${data.from.fullAddress} to ${data.to.fullAddress}`
      }));
    } catch (err) {console.error(err);}
  }
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
