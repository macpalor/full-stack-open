import Weather from "./Weather"

const Country = ({country}) => {
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
        <Weather country={country} />
      </>
    )
  }

export default Country