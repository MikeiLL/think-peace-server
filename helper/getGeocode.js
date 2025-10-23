const NodeGeocoder = require("node-geocoder");

const stubs = {
  "somewhere": {
    "fullAdress": "Somewhere",
    "city": "",
    "country": "",
    "countryCode": "",
    "position": {
      "lat": null,
      "lng": null
    }
  },
  "earth": {
    "fullAdress": "Earth",
    "city": "",
    "country": "",
    "countryCode": "",
    "position": {
      "lat": null,
      "lng": null
    }
  },
}

const getGeocode = async (address_label) => {
  const options = {
    provider: "google",

    // Optional depending on the providers
    // fetch: customFetchImplementation,
    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  };

  const stub = stubs[address_label.toLowerCase()];
  if (stub) return stub;

  const geocoder = NodeGeocoder(options);

  // Using callback
  const res = await geocoder.geocode(address_label);
  const resObj = res[0];
  const resp = {
    fullAdress: resObj?.formattedAddress,
    lat: resObj?.latitude,
    lng: resObj?.longitude,
    city: resObj?.city,
    country: resObj?.country,
    countryCode: resObj?.countryCode,
  };

  return resp;
};

module.exports = { getGeocode };
