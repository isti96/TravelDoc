const mongoose = require("mongoose");

const CountrieSchema = new mongoose.Schema({
  index: Number,

  countryName: String,

  visa: {
    type: Array,
    required: true,
    countryName: String,
    under18: Boolean,
    over18: Boolean
  },
  passport: {
    type: Array,
    countryName: String,
    under18: Boolean,
    over18: Boolean
  },
});

const CountryModel = mongoose.model("countries", CountrieSchema);
module.exports = CountryModel;
