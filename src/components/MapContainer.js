import React, { Component } from 'react';
import Map from './Map'
import { Marker, InfoWindow } from 'react-google-maps'
import '../App.css';

const MapContainer = (props) => {

  const { showingVenues } = props
  return (
    <Map
      markers={showingVenues.map((venue) => venue.marker)}
    />
  )

}

export default MapContainer
