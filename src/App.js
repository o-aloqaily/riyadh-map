import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import MapContainer from './components/MapContainer'
import { push as Menu } from 'react-burger-menu'

class App extends Component {
  state = {
    venues: []
  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="outer-container">
        <Menu
          burgerButtonClassName='bm-burger-button'
          pageWrapId={ "page-wrap" }
          outerContainerId={ "outer-container" }
        >
          <a id="home" className="bm-item">Home</a>
          <a id="about" className="menu-item">About</a>
          <a id="contact" className="menu-item">Contact</a>
          <a onClick={ this.showSettings } className="menu-item--small">Settings</a>
        </Menu>
        <div id="page-wrap">
          <Header />
          <MapContainer/>
        </div>
      </div>

    )
  }
}

export default App;
