import React from 'react';
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

// center prop for GoogleMap component is given by default the cord's of riyadh city
// but if there is an active marker it will center the map on the cord's of that marker

const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAV-oqmMGsaBhqfQWggCf8jIuGGRbuN9rg",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `90vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs, withGoogleMap)((props) =>
    <GoogleMap
      defaultZoom={11}
      center={{ lat: props.center.lat || 24.726645, lng: props.center.lng || 46.706998 }}
    >
    {
      // Access the marker inside the venue, Show them in the map.
      props.markers
    }
    </GoogleMap>
  )
export default Map
