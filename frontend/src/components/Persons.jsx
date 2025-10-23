const Person = ({name, number, deletePersonOf}) => {
  return (
    <p>
      {name} {number} &nbsp;
      <button onClick={deletePersonOf}>delete</button>
    </p>
  )
}

const Persons = ({personsToDisplay, deletePersonHandler}) => {
  return (
    <>
      {personsToDisplay.map((person) =>
        <Person key={person.id} name={person.name} number={person.number} deletePersonOf={() => deletePersonHandler(person.id)}/>
      )}
    </>
  )
}

export default Persons