import Country from './Country'

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

export default Countries