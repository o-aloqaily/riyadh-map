import React from 'react';
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

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
      defaultCenter={{ lat: 24.726645, lng: 46.706998 }}
    >
    {
      // Access the marker inside the venue, Show them in the map.
      props.markers
    }
    </GoogleMap>
  )
export default Map
