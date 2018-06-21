import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Map from './components/Map'
import SideMenu from './components/SideMenu'
import InfoWindowContent from './components/InfoWindowContent'
import { Marker, InfoWindow } from 'react-google-maps'
import '../node_modules/font-awesome/css/font-awesome.min.css';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import data from './data/venues.json'

const FOURSQUARE_AUTH = 'client_id=4QXNHUM0PF1VPWSMRLF0SDOE55PVTREB2UP4O5P3QU2AQUWE&client_secret=4QF0MWI05FSRTZXBLCAKTGEMCJSN10UJWGKM1QSLRSMZ53DH&v=20180710'
class App extends Component {

  state = {
    venues: [],
    showingVenues: [],
    filterInput: '',
  }

  componentDidMount() {
    this.fetchPlaces()
    this.manageInitialFocus()
  }

  // focus enhancements
  manageInitialFocus() {
    // disable burger menu items focus
    [...document.querySelectorAll('.bm-item-list a')].forEach((item) => { item.tabIndex = -1 });
    document.querySelector('.bm-cross-button button').tabIndex = -1

    // give an outline for burger menu icon when focused and remove it on blur
    document.querySelector('.bm-burger-button button').addEventListener('focus', function(){
      document.querySelector('.bm-burger-button').classList.add('outline')
    })
    document.querySelector('.bm-burger-button button').addEventListener('blur', function(){
      document.querySelector('.bm-burger-button').classList.remove('outline')
    })

    // give an outline for close burger menu icon when focused and remove it on blur
    document.querySelector('.bm-cross-button button').addEventListener('focus', function(){
      document.querySelector('.bm-cross-button').classList.add('outline')
    })
    document.querySelector('.bm-cross-button button').addEventListener('blur', function(){
      document.querySelector('.bm-cross-button').classList.remove('outline')
    });
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
    .catch((error) => {
      this.setState({
        venues: data,
        showingVenues: this.prepareShowingVenues(data)
      })
      this.renderErrorMessage(error)
    })
  }

  renderErrorMessage(error) {
    Alert.error(`Sorry! We could not load venues details.
      Please check your network connection ${error}`, {
      position: 'top',
      effect: 'slide',
      html: false,
    });
  }

  prepareShowingVenues(items) {
    return items.map((item, index) => {
      // item is an array item, item.venue includes a single venue details
      // from foursquare.
      let venue = {}
      venue.details = item
      venue.isInfoWindowVisible = false
      venue.marker = this.createVenueMarker(venue, index)

      return venue
    })
  }

  createVenueMarker(venueObject, index, animation = 2) {
    // animation values: 0 = no animation (stop bouncing), 1 = bouncing, 2 = drop
    // venueObject.venue includes a single venue details
    // from foursquare.
    const { location } = venueObject.details.venue
    return (
      <Marker
        key={index}
        animation={animation}
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
    // venueObject is an object that represents a single venue contained in showingVenues
    // => .details contains general details about the venue,
    // => .venue contains more specific details

    // if there is no photo, then foursquare api didn't load (no connection)
    if (!venueObject.details.photo) {
      return (
        <div>
          <h2>{venueObject.details.venue.name}</h2>
          <p>Sorry, no network connection</p>
        </div>
      )
    } else {
      return (
        <InfoWindowContent venueObject={venueObject} />
      )
    }
  }

  toggleInfoWindow(index, hasClosedOpenWindow) {
    if (!hasClosedOpenWindow) {
      if (this.state.showingVenues[index].isInfoWindowVisible) {
        return
      }
      this.closeOpenInfoWindows()
    }
    let updatedShowingVenues = this.state.showingVenues
    const { isInfoWindowVisible, marker } = updatedShowingVenues[index]
    let newAnimation = marker.props.animation === 0 || marker.props.animation === 2 ? 1 : 0
    // 0 = no animation (stop bouncing), 1 = bouncing, 2 = drop

    updatedShowingVenues[index].isInfoWindowVisible = !isInfoWindowVisible
    updatedShowingVenues[index].marker =
      this.createVenueMarker(updatedShowingVenues[index], index, newAnimation)
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

  handleFilterChange(newValue, index) {
    if (newValue === '') {
      let correspondingVenues = this.prepareShowingVenues(this.state.venues)
      this.setState({ filterInput: newValue, showingVenues: correspondingVenues })
    } else {
      const { venues } = this.state

      let correspondingVenues = venues.filter((location) => {
        return location.venue.name.toUpperCase().includes(newValue.toUpperCase())
      })
      correspondingVenues = this.prepareShowingVenues(correspondingVenues)
      this.setState({ filterInput: newValue, showingVenues: correspondingVenues })

    }
  }

  handleResultClick(venueName, index) {
    const { venues, showingVenues } = this.state
    let showingVenue = venues.filter(({venue}) => venue.name === showingVenues[index].details.venue.name)
    showingVenue = this.prepareShowingVenues(showingVenue)
    this.setState({ filterInput: venueName, showingVenues: showingVenue },
      () => this.toggleInfoWindow.call(this, 0)
    )
  }

  handleDeleteFilter(e) {
    this.setState({ filterInput: '' })
    this.handleFilterChange('')
  }

  // helper function for the next function onMenuStateChange
  focusFunction() {
    // focus on
    document.querySelector('.bm-item-list input').focus()
  }

  // handles and locks focus on the appropriate area
  onMenuStateChange(menuState) {
    if (menuState.isOpen) {
      // if menu is open lock focus on menu elements only
      [...document.querySelectorAll('.bm-item-list a')].forEach((item) => item.tabIndex = 0);
      document.querySelector('.bm-burger-button button').tabIndex = -1;
      document.querySelector('.bm-cross-button button').tabIndex = 0;
      document.querySelector('.bm-item-list input').tabIndex = 0;
      document.querySelector('.bm-item-list input').focus();

      // when focus goes out of menu, force focus on the menu again
      document.querySelector('.gm-style > [tabindex]').addEventListener('focus', this.focusFunction)
    } else {
      // if menu is closed lock focus on main page
      [...document.querySelectorAll('.bm-item-list a')].forEach((item) => item.tabIndex = -1);
      document.querySelector('.bm-burger-button button').tabIndex = 0;
      document.querySelector('.bm-cross-button button').tabIndex = -1;
      document.querySelector('.bm-item-list input').tabIndex = -1;

      // remove the event listener so the focus be on the page again
      document.querySelector('.gm-style > [tabindex]').removeEventListener('focus', this.focusFunction)

      document.querySelector('.bm-burger-button button').focus();
    }
  }

  render() {
    const { filterInput, showingVenues } = this.state

    // if there is an active marker (clicked to be viewed) get the location of it
    // to center it on the map
    let mapCenter = showingVenues.filter((venue) => venue.isInfoWindowVisible)
    if (mapCenter.length)
      mapCenter = mapCenter[0].details.venue.location


    // outer-container & page-wrap elements stand to help the sidemenu animate correctly
    return (
      <div id="outer-container">

        <SideMenu
          onMenuStateChange={this.onMenuStateChange.bind(this)}
          showingVenues={showingVenues}
          handleFilterChange={this.handleFilterChange.bind(this)}
          handleResultClick={this.handleResultClick.bind(this)}
          handleDeleteFilter={this.handleDeleteFilter.bind(this)}
          filterInput={filterInput}
        />
        <div id="page-wrap">
          <Header />
          <Map
            markers={showingVenues.map((venue) => venue.marker)}
            center={mapCenter}
          />
        </div>
        <Alert stack={{limit: 3}} />
      </div>

    )
  }
}

export default App;
