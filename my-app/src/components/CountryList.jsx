import React, { useState, useEffect } from "react";
import "./CountryList.css";
import Axios from "axios";

var targetValue;

function CountryList() {
  const [listOfCountries, setListOfCountries] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/getCountries").then((response) => {
      setListOfCountries(response.data);
    });
  }, []);

  const handleCountryChange = (e) => {
    console.log(e.target.value);
    targetValue = e.value;
    // Axios.get("http://localhost:3001/getOne/".concat(e.target.value)).then(
    //   (response) => {
    //     setListOfCountriesVisa(response.data);
    //   }
    // );
  };

  return (
    <div className="country">
      <select onChange={handleCountryChange}>
        <option value="Countries"> Countries </option>
        {listOfCountries.map((country) => (
          <option>{country.countryName}</option>
        ))}
      </select>
    </div>
  );
}

export default CountryList;
export { targetValue };
