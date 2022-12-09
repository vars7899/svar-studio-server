const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    postalCode: {
      type: String,
      default: null,
    },
    lat: { type: String, default: null },
    lng: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("address", AddressSchema);
module.exports = Address;
