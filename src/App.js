import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import MapContainer from './components/MapContainer'
import { push as Menu } from 'react-burger-menu'
import { Marker, InfoWindow } from 'react-google-maps'
import '../node_modules/font-awesome/css/font-awesome.min.css';

const FOURSQUARE_AUTH = 'client_id=4QXNHUM0PF1VPWSMRLF0SDOE55PVTREB2UP4O5P3QU2AQUWE&client_secret=4QF0MWI05FSRTZXBLCAKTGEMCJSN10UJWGKM1QSLRSMZ53DH&v=20180710'
class App extends Component {
  state = {
    venues: [],
    showingVenues: [],
    filterInput: ''
  }

  componentDidMount() {
    this.fetchPlaces()
  }

  fetchPlaces() {
    fetch(`https://api.foursquare.com/v2/lists/389806243/riyadhmap?${FOURSQUARE_AUTH}`)
    .then((response) => response.json())
    .then(({ response }) => {
      const { items } = response.list.listItems
      this.setState({
        venues: items,
        showingVenues: this.prepareShowingVenues(items)
      })
    })
  }

  prepareShowingVenues(items) {
    return items.map((item, index) => {
      // item is an array item, item.venue includes a single venue details
      // from foursquare.

      // venue object will be keeping the venue details in our showingVenues
      // list located in this.state
      let venue = new Object()

      venue.details = item
      venue.isInfoWindowVisible = false
      venue.marker = this.createVenueMarker(venue, index)

      return venue
    })
  }

  createVenueMarker(venueObject, index) {
    // venueObject.venue includes a single venue details
    // from foursquare.
    const { location } = venueObject.details.venue
    return (
      <Marker
        key={index}
        defaultAnimation={2}
        position={{ lat: location.lat, lng: location.lng }}
        onClick={ () => this.toggleInfoWindow(index, false) }
      >
      {
        venueObject.isInfoWindowVisible &&
          <InfoWindow
            onCloseClick={ () => this.toggleInfoWindow(index, true) }
            key={index}
          >
            {this.renderInfoWindow(venueObject)}
          </InfoWindow>
      }
      </Marker>
    )
  }

  renderInfoWindow(venueObject) {
    // venueObject is a this.state object contained in showingVenues
    // => .details contains general details about the venue,
    // => .venue contains more specific details
    const { photo } = venueObject.details
    let { id } = venueObject.details
    const { name, location, categories } = venueObject.details.venue
    let address = this.formatAddress(location)
    id = id.slice(1,id.length)
    return (
      <div className='infoWindow'>
        <img className='infoWindowImg' src={`${photo.prefix}200x200${photo.suffix}`} />
        <p className='infoWindowName'>{ name }</p>
        <p className='infoWindowAddress'>{ address }</p>
        <div className='infoWindowCategoryContainer'>
          <img className='infoWindowCatIcon' src={`${categories[0].icon.prefix}32${categories[0].icon.suffix}`} />
          <p className='infoWindowCat'>{ categories[0].name }</p>
        </div>
        <a target="_blank" className='infoWindowMore' href={`https://foursquare.com/v/${id}`}>More Details</a>
        <p className='by4S'>Powered by Foursquare</p>
      </div>

    )
  }

  formatAddress(location) {
    let address = ""
    if (location.address) {
      address += location.address
      if (location.city)
        address += ", "
    }
    if (location.city) {
      address += location.city
    }
    return address
  }

  toggleInfoWindow(index, hasClosedOpenWindow) {
    if (!hasClosedOpenWindow) {
      this.closeOpenInfoWindows()
    }
    let updatedShowingVenues = this.state.showingVenues
    const { isInfoWindowVisible } = updatedShowingVenues[index]
    updatedShowingVenues[index].isInfoWindowVisible = !isInfoWindowVisible

    updatedShowingVenues[index].marker =
      this.createVenueMarker(updatedShowingVenues[index], index)

    this.setState({ showingVenues: updatedShowingVenues })
  }

  closeOpenInfoWindows() {
    const { showingVenues } = this.state
    for (let index in showingVenues) {
      if (showingVenues[index].isInfoWindowVisible) {
        this.toggleInfoWindow(index, true)
      }
    }
  }

  handleFilterChange(newValue) {
    if (newValue === '') {
      let correspondingVenues = this.prepareShowingVenues(this.state.venues)
      this.setState({ filterInput: newValue, showingVenues: correspondingVenues })
    } else {
      const { showingVenues, venues } = this.state

      let correspondingVenues = venues.filter((location) => {
        return location.venue.name.toUpperCase().includes(newValue.toUpperCase())
      })
      correspondingVenues = this.prepareShowingVenues(correspondingVenues)

      this.setState({ filterInput: newValue, showingVenues: correspondingVenues })
    }
  }

  handleResultClick(venue) {
    this.setState({ filterInput: venue })
    this.handleFilterChange(venue)
  }

  render() {
    const { filterInput, showingVenues } = this.state
    console.log(showingVenues)
    return (
      <div id="outer-container">
        <Menu
          burgerButtonClassName='bm-burger-button'
          pageWrapId={ "page-wrap" }
          outerContainerId={ "outer-container" }
        >
          <div className='filterTitleContainer'>
            <i className="fa fa-filter"></i>
            <p className='filterTitle'>Filter Locations</p>
          </div>
          <input
            className='filterInput'
            value={filterInput}
            onChange={(e) => this.handleFilterChange(e.target.value) }
            placeholder='Search for something!'
          />
          <a onClick={() => this.handleResultClick('')}><i className="fa fa-times deleteFilterIcon"></i></a>
          {
            showingVenues.map((location, index) => {
              let { name } = location.details.venue
              name = name.replace(/[^\w\s\d!"?']/g,'');
              return (
                <div key={index}>
                  <a
                    key={index}
                    className={ (index%2==0) ? 'list-item dark' : 'list-item' }
                    onClick={() => this.handleResultClick(name.trim()) }
                  >
                    { name }
                  </a>
                </div>
              )
            })
          }
        </Menu>
        <div id="page-wrap">
          <Header />
          <MapContainer showingVenues={showingVenues} />
        </div>
      </div>

    )
  }
}

export default App;
