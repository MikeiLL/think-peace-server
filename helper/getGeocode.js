const NodeGeocoder = require("node-geocoder");

const getGeocode = async (address) => {
  const options = {
    provider: "google",

    // Optional depending on the providers
    // fetch: customFetchImplementation,
    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  };

  const geocoder = NodeGeocoder(options);

  // Using callback
  const res = await geocoder.geocode(address);
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
