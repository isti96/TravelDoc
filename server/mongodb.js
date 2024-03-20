var url = "mongodb://localhost:27017/MyDatabase";

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const CountryModel = require("./models/Countries");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/MyDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

function mapDocument(myDocument, from, age) {
  let require = false;
  myDocument.map((countryName) => {
    if (countryName.countryName === from) {
      require = age === "under18" ? countryName.under18 : countryName.over18;
    }
  });
  return require;
}

app.get("/getCountries", (req, res) => {
  CountryModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/checkVisa/:from/:to/:age", (req, res) => {
  CountryModel.findOne(
    { countryName: req.params.to },
    "countryName visa -_id",
    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        let requireVisa = mapDocument(
          result.visa,
          req.params.from,
          req.params.age
        );

        res.json(JSON.parse(' {"visa": '.concat(requireVisa).concat("}")));
      }
    }
  );
});

app.get("/checkPassport/:from/:to/:age", (req, res) => {
  CountryModel.findOne(
    { countryName: req.params.to },
    "countryName passport -_id",
    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        let requirePassport = mapDocument(
          result.passport,
          req.params.from,
          req.params.age
        );
        res.json(
          JSON.parse(' {"passport": '.concat(requirePassport).concat("}"))
        );
      }
    }
  );
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`server runs at port ${PORT}`);
});
