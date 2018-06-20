import React from 'react'

const SearchBar = (props) => {
  return (
    <div>
      <div className='filterTitleContainer'>
        <i className="fa fa-filter"></i>
        <p className='filterTitle'>Filter Locations</p>
      </div>
      <input
        aria-label="Search"
        tabIndex={-1}
        className='filterInput'
        value={props.filterInput}
        onChange={(e) => props.handleFilterChange(e.target.value) }
        placeholder='Search for something!'
      />
      <a
        role="button"
        tabIndex={-1}
        id='deleteFilter'
        className='deleteFilterIcon'
        onClick={(e) => props.handleDeleteFilter(e)}
        onKeyPress={(e) => e.charCode === 13 ? props.handleDeleteFilter(e) : null}
      >
        <i className="fa fa-times"></i>
      </a>
    </div>
  )
}

export default SearchBar
