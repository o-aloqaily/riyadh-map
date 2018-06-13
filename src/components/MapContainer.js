import React, { Component } from 'react';
import Map from './Map'
import { Marker, InfoWindow } from 'react-google-maps'
import '../App.css';


const FOURSQUARE_AUTH = 'client_id=4QXNHUM0PF1VPWSMRLF0SDOE55PVTREB2UP4O5P3QU2AQUWE&client_secret=4QF0MWI05FSRTZXBLCAKTGEMCJSN10UJWGKM1QSLRSMZ53DH&v=20180710'
class MapContainer extends Component {
  state = {
    venues: [],
    showingVenues: []
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
        showingVenues: items.map((item, index) => {
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
      })
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
    const { name, location, categories } = venueObject.details.venue
    let address = this.formatAddress(location)

    return (
      <div className='infoWindow'>
        <img className='infoWindowImg' src={`${photo.prefix}200x200${photo.suffix}`} />
        <p className='infoWindowName'>{ name }</p>
        <div className='infoWindowCategoryContainer'>
          <img className='infoWindowCatIcon' src={`${categories[0].icon.prefix}32${categories[0].icon.suffix}`} />
          <p className='infoWindowCat'>{ categories[0].name }</p>
        </div>
        <p className='infoWindowAddress'>{ address }</p>
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

  render() {
    console.log(this.state)
    const { showingVenues } = this.state
    return (
      <Map
        markers={showingVenues.map((venue) => venue.marker)}
      />
    )
  }
}

export default MapContainer
