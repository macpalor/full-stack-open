import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    countryService
    .getAll()
    .then(response => {
      console.log('Fetching countries...')
      // add a field to hide/display a country when rendering
      setCountries(response.map(item => ({...item, display : false})))
    })
    .catch(error => console.log("Failed to fetch countries", error))
  }, [])
  
  if (!countries) {
    return null
  }

  
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const toggleShow = (country) => {
    const countryName = countries.find(item => item.name.common === country.name.common)
    const changedCountry = {...countryName, display: !countryName.display}
    setCountries(countries.map(item => 
      item.name.common !== country.name.common
      ? item
      : changedCountry))
  }

  const filtered = filter === "" 
  ? countries
  : countries.filter(item => item.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <Countries countries={filtered} onShow={toggleShow} />
    </>
  )
}

export default App
