require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const CountryModel = require("./models/Countries");

const app = express();
const PORT = process.env.PORT || 3001;
const databaseUrl = process.env.MONGOD_CONNECT_URI;

mongoose
  .connect(
    `mongodb+srv://isti96:${databaseUrl}@cluster0.y5si3nq.mongodb.net/MyDatabase`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(cors());
app.use(express.json());

// Helper function to check visa/passport requirements
function checkRequirement(docArray, destination, age) {
  const country = docArray.find((c) => c.countryName === destination);
  return country
    ? age === "under18"
      ? country.under18
      : country.over18
    : false;
}

// Get all countries
app.get("/getCountries", async (req, res) => {
  try {
    const countries = await CountryModel.find({});
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// Check Visa Requirement
app.get("/checkVisa/:from/:to/:age", async (req, res) => {
  try {
    const { from, to, age } = req.params;
    const result = await CountryModel.findOne({ countryName: from }, "visa");

    if (!result) {
      return res.status(404).json({ error: "Country not found" });
    }

    const requireVisa = checkRequirement(result.visa, to, age);
    res.json({ visa: requireVisa });
  } catch (error) {
    res.status(500).json({ error: "Error checking visa requirement" });
  }
});

// Check Passport Requirement
app.get("/checkPassport/:from/:to/:age", async (req, res) => {
  try {
    const { from, to, age } = req.params;
    const result = await CountryModel.findOne(
      { countryName: from },
      "passport"
    );

    if (!result) {
      return res.status(404).json({ error: "Country not found" });
    }

    const requirePassport = checkRequirement(result.passport, to, age);
    res.json({ passport: requirePassport });
  } catch (error) {
    res.status(500).json({ error: "Error checking passport requirement" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
