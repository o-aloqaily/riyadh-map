import React from 'react'
import { push as Menu } from 'react-burger-menu'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'

const SideMenu = (props) => {
  return (
    <Menu
      pageWrapId={ "page-wrap" }
      outerContainerId={ "outer-container" }
      onStateChange={ props.onMenuStateChange }
    >

      <SearchBar
        filterInput={props.filterInput}
        handleFilterChange={props.handleFilterChange}
        handleDeleteFilter={props.handleDeleteFilter}
      />

      <SearchResults
        showingVenues={props.showingVenues}
        handleResultClick={props.handleResultClick}
      />

    </Menu>
  )
}

export default SideMenu
