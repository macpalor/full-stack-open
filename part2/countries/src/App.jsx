import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = (props) => {
  return (
    <>
      Find countries <input value={props.filter} onChange={props.onFilterChange} />
    </>
  )
}

const Weather = ({weather}) => {
  if (!weather) {
    return null
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <>
      <h3>Weather in {weather.name}</h3>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img src={iconUrl} />
      <p>Wind {weather.wind.speed} m/s</p>
    </>
  )
}

const Country = ({country}) => {
  const [capitalWeather, setCapitalWeather] = useState(null)

  useEffect(() => {
    weatherService
    .getWeather(country.capital[0])
    .then(response => {
      console.log('Fetching weather data for', country.capital[0])
      setCapitalWeather(response)
    })
    .catch(error => console.log('Failed to fetch weather data', error))
  }, [country.capital[0]])


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

      <img className='flag' src={country.flags.png} alt={country.flags.alt} />
      <Weather weather={capitalWeather} />
    </>
  )
}

const Countries = ({countries, onShow}) => {
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
