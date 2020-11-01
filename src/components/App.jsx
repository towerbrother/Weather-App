import React, { useState } from "react";
import Form from "./Form";
import Weather from "./Weather";
import Error from "./Error";
import LoadingPage from "./LoadingPage";
import Footer from "./Footer";
import Header from "./Header";
import WeatherContext from "./../context/weatherContext";

const API = "f9b82988a14039290e02b95f5e395184";

const App = () => {
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataCurrent, setDataCurrent] = useState(null);
  const [dataForecast, setDataForecast] = useState(null);
  const [unitMeasure, setUnitMeasure] = useState("metric");
  const [queryStringCity, setQueryStringCity] = useState("");
  const [queryStringCountry, setQueryStringCountry] = useState("");

  const handleChange = (e) => {
    setQueryStringCountry("");
    const name = e.target.name;
    if (name === "queryStringCity") setQueryStringCity(e.target.value);
    if (name === "queryStringCountry") setQueryStringCountry(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr(null);
    setDataCurrent(null);
    setDataForecast(null);
    setLoading(true);

    fetch(
      `${window.location.protocol}//api.openweathermap.org/data/2.5/weather?q=${queryStringCity},${queryStringCountry}&APPID=${API}`
    )
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((dataCurrent) => {
        setDataCurrent(dataCurrent);
        setLoading(false);
      })
      .catch((err) => {
        setErr(err);
        setLoading(loading - 1);
      });

    fetch(
      `${window.location.protocol}//api.openweathermap.org/data/2.5/forecast?q=${queryStringCity},${queryStringCountry}&APPID=${API}`
    )
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((dataForecast) => {
        setDataForecast(dataForecast);
        setLoading(false);
      })
      .catch((err) => {
        setErr(err);
        setLoading(loading - 1);
      });

    setQueryStringCity("");
    setQueryStringCountry("");
  };

  const handleRadioChecked = (e) => {
    setUnitMeasure(e.target.value);
  };

  return (
    <div className="wrapper">
      <Header
        title="Weather App"
        subtitle="Check the weather before getting out of the house!"
      />
      <WeatherContext.Provider
        value={{
          dataCurrent,
          dataForecast,
          queryStringCity,
          queryStringCountry,
          unitMeasure,
          handleChange,
          handleSubmit,
          handleRadioChecked,
        }}
      >
        <div className="App">
          <div className="container">
            <Form />
            {err && <Error err={err} />}
            {loading ? (
              <LoadingPage />
            ) : (
              dataCurrent && dataForecast && <Weather />
            )}
          </div>
        </div>
        <Footer
          author="Giorgio Torre"
          url="https://towerbrother.github.io/portfolio-app"
        />
      </WeatherContext.Provider>
    </div>
  );
};

export default App;
