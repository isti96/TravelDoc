const mongoose = require("mongoose");

const visaSchema = new mongoose.Schema({
  type: Array,
  countryName: String,
  under18: String,
});

const passportSchema = new mongoose.Schema({
  type: Array,
  countryName: String,
  under18: String,
});

const CountrieSchema = new mongoose.Schema({
  index: Number,

  countryName: String,

  visa: {
    type: Array,
    required: true,
    countryName: String,
    under18: String,
  },
  passport: {
    type: Array,
    countryName: String,
    under18: String,
  },
});

const CountryModel = mongoose.model("countries", CountrieSchema);
module.exports = CountryModel;
