import "./App.css";
import Header from "./components/Header";
import GoButton from "./components/GoButton";
import { useEffect, useState } from "react";
import Axios from "axios";
import { HiSwitchHorizontal } from "react-icons/hi";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

var url1 = "http://localhost:3001/checkPassport/";
var url2 = "http://localhost:3001/checkVisa/";
function App() {
  const [listOfCountries, setListOfCountries] = useState([""]);
  const [listOfCountryVisa, setListOfCountriesVisa] = useState([""]);
  const [listOfCountryPassport, setListOfCountriesPassport] = useState([""]);
  const [targetValueFrom, setTargetValueFrom] = useState("");
  const [targetValueTo, setTargetValueTo] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/getCountries").then((response) => {
      setListOfCountries(response.data.map((c) => c.countryName));
      
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

  function flip() {
    console.log("flip");
    var temp = targetValueFrom;
    setTargetValueFrom(targetValueTo);
    console.log(targetValueFrom);
    setTargetValueTo(temp);
    console.log(targetValueTo);
  }

  return (
    <div className="app">
      <Header />
      <div className="countrylist">
        <span>From:</span>
        <Dropdown
          options={listOfCountries}
          onChange={(e) => {
            setTargetValueFrom(e.value);
          }}
          value={targetValueFrom}
          placeholder="Countries"
        />
      </div>
      <div className="switch">
        <HiSwitchHorizontal
          size="30px"
          onClick={() => {
            flip();
          }}
        />
      </div>

      <div className="countrylist">
        <span>To:</span>
        <Dropdown
          options={listOfCountries}
          onChange={(e) => {
            setTargetValueTo(e.value);
          }}
          value={targetValueTo}
          placeholder="Countries"
        />
      </div>
      <div className="age">
        <p>Age:</p>
        <div>
          <input type="radio" name="age" />
          <label>under 18</label>
        </div>
        <div>
          <input type="radio" name="age" />
          <label>over 18</label>
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
