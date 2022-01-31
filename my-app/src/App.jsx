import "./App.css";
import Header from "./components/Header";
import GoButton from "./components/GoButton";
import { useEffect, useState } from "react";
import Axios from "axios";

var targetValueFrom;
var targetValueTo;
var url1 = "http://localhost:3001/checkPassport/";
var url2 = "http://localhost:3001/checkVisa/";
function App() {
  const [listOfCountries, setListOfCountries] = useState([""]);
  const [listOfCountryVisa, setListOfCountriesVisa] = useState([""]);
  const [listOfCountryPassport, setListOfCountriesPassport] = useState([""]);
 

  useEffect(() => {
    Axios.get("http://localhost:3001/getCountries").then((response) => {
      setListOfCountries(response.data);
    });
  }, []);

  const axiosFetch = () => {
    Axios.get(url2.concat(targetValueFrom + "/").concat(targetValueTo)).then(
      (response) => {
        console.log(response.data.visa);
        setListOfCountriesVisa(response.data.visa);
      }
    );

    Axios.get(url1.concat(targetValueFrom + "/").concat(targetValueTo)).then(
      (response) => {
        console.log(response.data.passport);
        setListOfCountriesPassport(response.data.passport);
      }
    );
  };

  const handleCountryChangeFrom = (e) => {
    console.log(e.target.value);
    targetValueFrom = e.target.value;
  };

  const handleCountryChangeTo = (e) => {
    console.log(e.target.value);
    targetValueTo = e.target.value;
  };
  return (
    <div className="app">
      <Header />
      <div className="countrylist">
        <span>From:</span>
        <div className="countryfrom">
          <select onChange={handleCountryChangeFrom}>
            <option value="Countries"> Countries </option>
            {listOfCountries.map((country) => (
              <option>{country.countryName}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="countrylist">
        <span>To:</span>
        <div className="countryto">
          <select onChange={handleCountryChangeTo}>
            <option value="Countries"> Countries </option>
            {listOfCountries.map((country) => (
              <option>{country.countryName}</option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={axiosFetch}>
        <GoButton />
      </button>
      <div>
        <p>The documents you need are:</p>
        <p>visa: {listOfCountryVisa ? "Yes" : "No"}</p>
        <p>passport: {listOfCountryPassport ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}

export default App;
