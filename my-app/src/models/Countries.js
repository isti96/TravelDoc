const mongoose = require("mongoose");

const CountrieSchema = new mongoose.Schema({
  index: {
    type: Number,
  },
  countryName: {
    type: String,
    required: true,
  },
  visa: {
    type: Array,
    of: Object,
  },
  passport: {
    type: Array,
    of: Object,
  },
});

const CountryModel = mongoose.model("countries", CountrieSchema);
module.exports = CountryModel;
