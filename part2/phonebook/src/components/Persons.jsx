import Person from './Person'

const Persons = ({persons, onDelete}) => {
    return (
      <table>
        <tbody>
          {persons.map(person =>
        <Person 
          key={person.id} 
          person={person}
          onDelete={onDelete}
        />)}
        </tbody>
      </table>
    )
  }

export default Persons