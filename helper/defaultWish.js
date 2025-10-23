

const defaultWish = () => {
  /*
  midnight would be
  new Date(Math.floor(+new Date() / 86400000) * 86400000).toISOString()
  */
  let date = new Date().toISOString();
  return {
    "from": {
      "position": {
        "lat": 30.4265866,
        "lng": -87.2796948
      },
      "city": "Venus",
      "country": "United States",
      "countryCode": "US",
      "fullAddress": "West Pensacola, FL, USA"
    },
    "to": {
      "position": {
        "lat": 40.7355105,
        "lng": -74.2679249
      },
      "city": "Mars",
      "country": "United States",
      "countryCode": "US",
      "fullAddress": "Maplewood, NJ, USA"
    },
    "hashTag": "#healing",
    "createdAt": date,
    "updatedAt": date,
  }
}

module.exports = { defaultWish };
