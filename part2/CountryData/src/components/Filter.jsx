
const Filter = ({country, setCountry}) => {
  return (
    <div>Find country <input type='search' value={country} onChange={(e)=> setCountry(e.target.value)} /></div>
  )
}

export default Filter