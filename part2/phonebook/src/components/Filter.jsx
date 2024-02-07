const Filter = (props) => {
    return (
      <div>
        filter shown with <input value={props.filter} onChange={props.onFilterChange}/>
      </div>
    )
  }

export default Filter