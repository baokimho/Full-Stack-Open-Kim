import { useState, useEffect} from 'react';
import getAll from './services/Countries';
import Filter from './components/Filter';
import CountryDetail from './components/CountryDetail';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getAll()
    .then(countries => setCountries(countries))
  }
  ,[])

  const countriesToShow = filter 
    ? countries.filter(countries => countries.name.common.toLowerCase().includes(filter.toLowerCase()))
    : []

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />

      {countriesToShow.length > 10 
      ? 'Too many matches, please specify the query'
      : countriesToShow.length === 1 ? <CountryDetail country={countriesToShow[0]} />
      : countriesToShow.map(country => (
        <div key={country.name.common}>
          <h2>{country.name.common}</h2> <button onClick={() => setFilter(country.name.common)}> Show </button>
        </div>
      ))}
    </div>
  )
}

export default App