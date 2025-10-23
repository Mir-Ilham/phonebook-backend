const PersonForm = ({addPerson, newName, changeInputName, newNumber, changeNumber}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={changeInputName}/>
      </div>
      <div>
        phone: <input value={newNumber} onChange={changeNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm