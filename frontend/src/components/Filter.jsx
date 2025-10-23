const Filter = ({query, changeQuery}) => {
  return (
    <div>
      Search: <input value={query} onChange={changeQuery}/>
    </div>
  )
}

export default Filter