import { useState, useEffect } from 'react';
import axios from 'axios';

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_WEATHER_API_KEY
  const [lat, lon] = country.latlng
  // console.log(country)
  // console.log([lat,lon])

  useEffect(()=> {
    if ( lat && lon && api_key) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
        .then(res => setWeather(res.data))
    }
  },[lat, lon, api_key])
  console.log(weather)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
      />
      {weather && (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>temperature {weather.main.temp} Celcius</p>
          
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetail