import React, { useState, useMemo, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import MapItem from './mapItem';
import axios from 'axios';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete';

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css"

function Mapp(props) {
  const { isLoaded } = useLoadScript({
    // better practice to put API key into ENV!!
    googleMapsApiKey: 'AIzaSyCHiRhiBXEfG9PCnAMeHI6qPuyupL02i78',
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>
  return (
    <div>
      <Map destination={props.destination} center={props.center} trip_id={props.trip_id} />
    </div>
  )
}
const url =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"

function Map(props) {
  const [selected, setSelected] = useState([]);
  const pins = selected.map((pin, i) => <MapItem
    position={pin}
    key={i}
    animation={google.maps.Animation.DROP}
  />)

  const { trip_id } = props;

  const [places, setPlaces] = useState(null);
  //on render, fetch to get all the stops for the trip
  useEffect(() => {
    axios.get('http://localhost:3000/places', {
      params: {
        trip_id
      }
    })
      .then((response) => {
        console.log(response);
        setPlaces(response.data);
        console.log('data from trip_id', response.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  //todo use places to get another set of pins

  return (
    <>
      <div className="places-container">
        <PlacesAutoComplete setSelected={setSelected} trip_id={trip_id} />
      </div>
      <GoogleMap
        zoom={6}
        center={props.center}
        mapContainerClassName="map-container"
      >
        <Marker position={props.center} icon={url} />
        {selected && pins}
      </GoogleMap>
    </>
  )
}
const PlacesAutoComplete = ({ setSelected, trip_id }) => {

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    console.log('find data here to save to database', results);

    const { lat, lng } = await getLatLng(results[0]);
    setSelected(selected => [...selected, { lat, lng }]);

    // console.log("geometry   ", results[0].geometry.location.lat);

    const newplace = {
      trip_id,
      google_place_id: results[0].place_id,
      name: 'test',
      address: results[0].formatted_address,
      type: "hotel",
      lat: lat,
      long: lng
    };
    console.log('new place', newplace);

    fetch('http://localhost:3000/addplace', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newplace)
    })
      .then(data => data.json())
        .then(data => {
          console.log('fetched data!', data);
        })
        .catch(e => {
          console.log(e);
        })
  };

  //construct the place object here
  //We have to construct this newplace object and send as the body for post. Those keys are required for database. we should find the value for the keys from results object from Geocode.


  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search Location" />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" && data.map(({ place_id, description }) => (
            <ComboboxOption key={place_id} value={description} />
          ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
};

export default Mapp