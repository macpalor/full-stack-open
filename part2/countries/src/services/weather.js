import axios from 'axios'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (city) => {
    const request = axios.get(`${weatherUrl}${city}&appid=${apiKey}&units=metric`)
    return request.then(response => response.data)
}

export default {getWeather}