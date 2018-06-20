import React from 'react'

const InfoWindowContent = (props) => {

  const { photo } = props.venueObject.details
  let { id } = props.venueObject.details
  id = id.slice(1,id.length)
  const { name, location, categories } = props.venueObject.details.venue
  let address = ""
  if (location.address) {
    address += location.address
    if (location.city)
      address += ", "
  }
  if (location.city) {
    address += location.city
  }

  return (
    <div className='infoWindow'>
      <img className='infoWindowImg' src={`${photo.prefix}200x200${photo.suffix}`} alt={name +' image'} />
      <h2 className='infoWindowName'>{ name }</h2>
      <p className='infoWindowAddress'>{ address }</p>
      <div className='infoWindowCategoryContainer'>
        <img className='infoWindowCatIcon' src={`${categories[0].icon.prefix}32${categories[0].icon.suffix}`} alt={categories[0].name +' category icon'} />
        <p className='infoWindowCat'>{ categories[0].name }</p>
      </div>
      <a target="_blank" className='infoWindowMore' href={`https://foursquare.com/v/${id}`}>More Details</a>
      <p className='by4S'>Powered by Foursquare</p>
    </div>
  )
}

export default InfoWindowContent
