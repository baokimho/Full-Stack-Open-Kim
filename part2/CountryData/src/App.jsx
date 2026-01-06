import { useState, useEffect} from 'react';
import getAll from './services/Countries';
import Filter from './components/Filter';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getAll()
    .then(countries => setCountries(countries))
  }
  ,[])

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      {/* {countries.map(country => (
        <div key={country.name.common}>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area} km²</p>
        </div>
      ))} */}
    </div>
  )
}

export default App