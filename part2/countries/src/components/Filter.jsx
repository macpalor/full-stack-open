const Filter = (props) => {
    return (
      <>
        Find countries <input value={props.filter} onChange={props.onFilterChange} />
      </>
    )
  }

export default Filter