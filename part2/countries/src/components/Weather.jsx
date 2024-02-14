import {useState, useEffect} from 'react'
import weatherService from '../services/weather'

const Weather = ({country}) => {
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
  
    if (!capitalWeather) {
      return null
    }
  
    const iconUrl = `https://openweathermap.org/img/wn/${capitalWeather.weather[0].icon}@2x.png`
    
    return (
      <>
        <h3>Weather in {capitalWeather.name}</h3>
        <p>Temperature {capitalWeather.main.temp} Celsius</p>
        <img src={iconUrl} />
        <p>Wind {capitalWeather.wind.speed} m/s</p>
      </>
    )
  }

export default Weather