
const Filter = ({filter, setFilter}) => {
  return (
    <div>Find country <input type='search' value={filter} onChange={(e)=> setFilter(e.target.value)} /></div>
  )
}

export default Filter