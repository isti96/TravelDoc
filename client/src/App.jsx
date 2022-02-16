import "./App.css";
import Header from "./components/Header";
import GoButton from "./components/GoButton";
import { useEffect, useState } from "react";
import Axios from "axios";
import { HiSwitchVertical } from "react-icons/hi";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

var url1 = 'https://traveldoc.herokuapp.com/checkPassport/';
var url2 = 'https://traveldoc.herokuapp.com/checkVisa/';
function App() {
  const [listOfCountries, setListOfCountries] = useState([""]);
  const [listOfCountryVisa, setListOfCountriesVisa] = useState();
  const [listOfCountryPassport, setListOfCountriesPassport] = useState();
  const [targetValueFrom, setTargetValueFrom] = useState("Countries");
  const [targetValueTo, setTargetValueTo] = useState("Countries");
  const [ageValue, ageInputProps] = useRadioButtons("age");
  const [dontNeedAnything, setDontNeedAnything] = useState(false);

  useEffect(() => {
    Axios.get('https://traveldoc.herokuapp.com/getCountries').then((response) => {
      setListOfCountries(response.data.map((c) => c.countryName));
    });
  }, []);

  const axiosFetch = () => {
    if (
      !ageValue ||
      targetValueFrom === "Countries" ||
      targetValueTo === "Countries"
    ) {
      alert("Please fill in all inputs with correct values");
    } else {
      Axios.get(
        url2
          .concat(targetValueFrom + "/")
          .concat(targetValueTo + "/")
          .concat(ageValue)
      ).then((response) => {
        setListOfCountriesVisa(response.data.visa);
      });

      Axios.get(
        url1
          .concat(targetValueFrom + "/")
          .concat(targetValueTo + "/")
          .concat(ageValue)
      ).then((response) => {
        setListOfCountriesPassport(response.data.passport);
      });

      setDontNeedAnything(true);
    }
  };

  function useRadioButtons(name) {
    const [value, setState] = useState(null);

    const handleChange = (e) => {
      setState(e.target.value);
    };

    const inputProps = {
      name,
      type: "radio",
      onChange: handleChange,
    };

    return [value, inputProps];
  }

  function flip() {
    var temp = targetValueFrom;
    setTargetValueFrom(targetValueTo);
    setTargetValueTo(temp);
  }

  return (
    <div className="app">
      <Header />
      <div className="countrylistContainer">
        {" "}
        <div className="countrylist">
          <span className="span">From:</span>
          <Dropdown
            options={listOfCountries}
            onChange={(e) => {
              setTargetValueFrom(e.value);
            }}
            value={targetValueFrom}
            placeholder="Countries"
            className="dropdownisti"
          />
        </div>
      </div>
      <button className="switchContainer btn-secondary rounded-circle">
        <div className="switch">
          <HiSwitchVertical
            size="20px"
            onClick={() => {
              flip();
            }}
          />
        </div>
      </button>

      <div className="countrylistContainer">
        <div className="countrylist">
          <span className="span">To:</span>
          <Dropdown
            options={listOfCountries}
            onChange={(e) => {
              setTargetValueTo(e.value);
            }}
            value={targetValueTo}
            placeholder="Countries"
          />
        </div>
      </div>
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
      <button onClick={axiosFetch} type="button" className="btn btn-primary rounded-circle">
        <GoButton />
      </button>
      <div style={{ visibility: dontNeedAnything ? "visible" : "hidden" }} className="resultdoc">
        {listOfCountryVisa ? (
          <div>
            <p>The documents you need are:</p>
            <p>visa</p>
            {listOfCountryPassport ? <p>passport</p> : ""}
          </div>
        ) : listOfCountryPassport ? (
          <div>
            <p>The documents you need are:</p>
            <p>passport</p>
          </div>
        ) : (
          <p>You don't need any document to travel between these countries</p>
        )}
      </div>
    </div>
  );
}

export default App;
