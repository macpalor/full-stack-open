import axios from 'axios'
const countryUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
    const request = axios.get(countryUrl)
    return request.then(response => response.data)
}

export default {getAll}