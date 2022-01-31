var url =
  "mongodb+srv://isti96:minesotagiants96@cluster0.kmmdl.mongodb.net/traveldoc?retryWrites=true&w=majority";

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const CountryModel = require("./models/Countries");
const cors = require("cors");

mongoose.connect(url);

app.use(cors());
app.use(express.json());

app.get("/getCountries", (req, res) => {
  CountryModel.find({}, " countryName -_id ", (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
      console.log(result);
    }
  });
});



app.get("/getOne/:country", (req, res) => {
  CountryModel.findOne(
    { countryName: req.params.country },
    "countryName -_id visa",
    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
        console.log("result:");
        console.log(result);
      }
    }
  );
});

app.get("/checkVisa/:from/:to", (req, res) => {
  CountryModel.findOne(
    { countryName: req.params.to },
    "countryName -_id visa",
    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        let requireVisa = false;
        result.visa.map((countryName) => {
          if (countryName.countryName === req.params.from) {
            requireVisa = true;
          }  console.log(countryName.countryName, " - ", req.params.from, requireVisa);
        });
        res.json(JSON.parse(' {"visa": '.concat(requireVisa).concat("}")));
      }
    }
  );
});

app.get("/checkPassport/:from/:to", (req, res) => {
  CountryModel.findOne(
    { countryName: req.params.to },
    "countryName -_id passport",
    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        let requirePassport = false;
        result.passport.map((countryName) => {
          if (countryName.countryName === req.params.from) {
            requirePassport = true;
          }  console.log(countryName.countryName, " - ", req.params.from, requirePassport);
        });
        res.json(JSON.parse(' {"passport": '.concat(requirePassport).concat("}")));
      }
    }
  );
});

app.listen(3001, () => {
  console.log("server runs");
});
