import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <>
      Find countries <input value={props.filter} onChange={props.onFilterChange} />
    </>
  )
}

const Country = ({country}) => {
  console.log("country is", country)
  console.log("languages", Object.values(country.languages))
  return (
    <>
      <h2>{country.name.common}</h2>
      
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>

      <b>Languages:</b>
      <ul>
        {Object.values(country.languages).map(item =>
          <li key={item}>{item}</li>)}
      </ul>
    </>
  )
}

const Countries = ({countries}) => {
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <table>
        <tbody>
          {countries.map(item => 
          <tr key={item.name.common}>
            <td>{item.name.common}</td>
          </tr>
          )}
        </tbody>
      </table>
      //countries.map(item => <div>{item.name.common}</div>)
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]}/>
    )
  }
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])
  
  if (!countries) {
    return null
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filtered = filter === "" 
  ? countries
  : countries.filter(item => item.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <Countries countries={filtered} />
    </>
  )
}

export default App
