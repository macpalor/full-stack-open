const Person = ({person, onDelete}) => {
    return (
      <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td>
          <button onClick={(event) => onDelete(event, person)}>delete</button>
        </td>
      </tr>
    ) 
  }

export default Person