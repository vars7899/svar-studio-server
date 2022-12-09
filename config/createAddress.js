const Address = require("../models/addressModel");

async function createAddress(res, address) {
  const { street, city, country, state, postalCode, lat, lng } = address;
  if (!street || !city || !country || !state || !postalCode || !lat || !lng) {
    res.status(400);
    throw new Error("Missing one or more required fields of address");
  }
  // create address in DB
  const generatedAddress = await Address.create({
    street,
    city,
    country,
    state,
    postalCode,
    lat,
    lng,
  });
  return generatedAddress;
}

module.exports = createAddress;
