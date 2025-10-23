const locations = [
  {
      "fullAddress": "Hiroshima, Japan",
      "city": "Hiroshima",
      "country": "Japan",
      "countryCode": "JP",
      "position": {
          "lat": 34.3852894,
          "lng": 132.4553055
      },
  }, {
    "fullAddress": "The Hague, Netherlands",
    "city": "The Hague",
    "country": "Netherlands",
    "countryCode": "NL",
    "position": {
      "lat": 52.0704978,
      "lng": 4.3006999
    },
  },
    {
      "fullAddress": "Geneva, Switzerland",
      "city": "Geneva",
      "country": "Switzerland",
      "countryCode": "CH",
      "position": {
          "lat": 46.2043907,
          "lng": 6.1431577
      },
  },
  {
    "fullAddress": "Delphi 330 54, Greece",
    "city": "Delphi",
    "country": "Greece",
    "countryCode": "GR",
    "position": {
        "lat": 38.4800567,
        "lng": 22.4940617
    },
  },
  {
    "fullAddress": "Çorum, Çorum Merkez/Çorum, Türkiye",
    "city": "Çorum",
    "country": "Türkiye",
    "countryCode": "TR",
    "position": {
        "lat": 40.54992560000001,
        "lng": 34.9537242
    },
}
];

const hashtags = [
  "#peace",
  "#love",
  "#hope",
  "#faith",
  "#friendship",
  "#healing",
];

const defaultWish = () => {
  /*
  midnight would be
  new Date(Math.floor(+new Date() / 86400000) * 86400000).toISOString()
  */
  const day = Math.floor(+new Date() / 86400000); //midnight,Number of days since 1970
  let date = new Date(day * 86400000).toISOString();
  return {
    "from": locations[((day + 1) ** 2) % locations.length],
    "to": locations[(day ** 2) % locations.length],
    "createdAt": date,
    "updatedAt": date,
    "hashTag": hashtags[(day ** 2) % hashtags.length]
  }
}

module.exports = { defaultWish };
