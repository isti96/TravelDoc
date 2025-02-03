import "./App.css";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import Axios from "axios";
import { HiSwitchVertical } from "react-icons/hi";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "@material-ui/core/Button";

const BASE_URL = "https://traveldoc.onrender.com";
const url1 = `${BASE_URL}/checkPassport/`;
const url2 = `${BASE_URL}/checkVisa/`;

function App() {
  const [listOfCountries, setListOfCountries] = useState([]);
  const [visaRequired, setVisaRequired] = useState(null);
  const [passportRequired, setPassportRequired] = useState(null);
  const [targetValueFrom, setTargetValueFrom] = useState("Countries");
  const [targetValueTo, setTargetValueTo] = useState("Countries");
  const [ageValue, ageInputProps] = useRadioButtons("age");
  const [dontNeedAnything, setDontNeedAnything] = useState(false);

  // Fetch the list of countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/getCountries`);
        const sortedCountries = response.data.map((c) => c.countryName).sort();
        setListOfCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch visa & passport info
  const axiosFetch = async () => {
    try {
      const [visaResponse, passportResponse] = await Promise.all([
        Axios.get(`${url2}${targetValueFrom}/${targetValueTo}/${ageValue}`),
        Axios.get(`${url1}${targetValueFrom}/${targetValueTo}/${ageValue}`),
      ]);

      setVisaRequired(visaResponse.data.visa);
      setPassportRequired(passportResponse.data.passport);
      setDontNeedAnything(true);
    } catch (error) {
      console.error("Error fetching travel documents:", error);
    }
  };

  // Custom hook for radio buttons
  function useRadioButtons(name) {
    const [value, setValue] = useState(null);

    const handleChange = (e) => setValue(e.target.value);

    return [value, { name, type: "radio", onChange: handleChange }];
  }

  // Swap 'From' and 'To' values
  function flip() {
    setTargetValueFrom((prev) => {
      setTargetValueTo(prev);
      return targetValueTo;
    });
  }

  return (
    <div className="app">
      <Header />

      {/* From Dropdown */}
      <div className="countrylistContainer">
        <div className="countrylist">
          <span className="span">From:</span>
          {listOfCountries.length ? (
            <Dropdown
              options={listOfCountries}
              onChange={(e) => setTargetValueFrom(e.value)}
              value={targetValueFrom}
              placeholder="Countries"
            />
          ) : (
            <span>Loading countries...</span>
          )}
        </div>
      </div>

      {/* Swap Button */}
      <Button
        variant="contained"
        className="switchContainer btn-secondary"
        color="primary"
        onClick={flip}
      >
        <HiSwitchVertical size="20px" />
      </Button>

      {/* To Dropdown */}
      <div className="countrylistContainer">
        <div className="countrylist">
          <span className="span">To:</span>
          {listOfCountries.length ? (
            <Dropdown
              options={listOfCountries}
              onChange={(e) => setTargetValueTo(e.value)}
              value={targetValueTo}
              placeholder="Countries"
            />
          ) : (
            <span>Loading countries...</span>
          )}
        </div>
      </div>

      {/* Age Selection */}
      <fieldset className="fieldset">
        <p>Age:</p>
        <div className="agefield">
          <input
            value="under18"
            id="under18"
            checked={ageValue === "under18"}
            {...ageInputProps}
          />
          <label htmlFor="under18"> Under 18</label>
        </div>
        <div className="agefield">
          <input
            value="over18"
            id="over18"
            checked={ageValue === "over18"}
            {...ageInputProps}
          />
          <label htmlFor="over18">Over 18</label>
        </div>
      </fieldset>

      {/* GO Button */}
      <Button
        variant="contained"
        className="button"
        color="primary"
        onClick={axiosFetch}
        disabled={
          !ageValue ||
          targetValueFrom === "Countries" ||
          targetValueTo === "Countries"
        }
      >
        <p className="button-p">GO</p>
      </Button>

      {/* Result Display */}
      <div
        style={{ visibility: dontNeedAnything ? "visible" : "hidden" }}
        className="resultdoc"
      >
        {visaRequired || passportRequired ? (
          <div>
            <p>The documents you need are:</p>
            {visaRequired && <p>Visa</p>}
            {passportRequired && <p>Passport</p>}
          </div>
        ) : (
          <p>You don't need any document to travel between these countries</p>
        )}
      </div>
    </div>
  );
}

export default App;
