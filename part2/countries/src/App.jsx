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
  //console.log("country is", country)
  //console.log("languages", Object.values(country.languages))
  const flagUrl = country.flags['png']
  //console.log("flag url is", flagUrl)

  return (
    <>
      <h2>{country.name.common}</h2>
      
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>

      <b>Languages:</b>
      <ul>
        {Object.values(country.languages).map((item, id) =>
          <li key={id}>{item}</li>)}
      </ul>

      <img className='flag' src={flagUrl} alt={`Flag of ${country.name.common}`} />
    </>
  )
}

const Countries = ({countries, onShow}) => {
  //console.log("shown is", isShown)
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
          {countries.map((item, id) => 
          <tr key={id}>
            {item.display ? null : <td>{item.name.common}</td>}
            {item.display ? <td> <Country country={item} /> </td> : null}
            <td>
              <button onClick={() => onShow(item)}>{item.display ? "hide" : "show"}</button>
            </td>
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
      console.log('fetching countries...')
      // add a field to hide/display a country when rendering
      setCountries(response.data.map(item => ({...item, display : false})))
    })
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
