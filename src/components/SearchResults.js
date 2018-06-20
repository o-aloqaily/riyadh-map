import React from 'react'

const SearchResults = (props) =>
  props.showingVenues.map((location, index) => {
    let { name } = location.details.venue
    name = name.replace(/[^\w\s\d!"?']/g,'');
    return (
      <div key={index}>
        <a
          role="result"
          tabIndex={0}
          key={index}
          className={ (index%2===0) ? 'list-item dark' : 'list-item' }
          onClick={() => props.handleResultClick(name.trim(), index) }
          onKeyPress={(e) => e.charCode === 13 ? props.handleResultClick(name.trim(), index): null }
        >
          { name }
        </a>
      </div>
    )
  })

export default SearchResults
