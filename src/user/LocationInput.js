import React, { useState, useEffect, useContext, useRef } from "react";
import { location_state } from '../util/input';
import { Context } from '../Contexts'

let autoComplete;

// Reference: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform

// dynamically load JavaScript files in html with callback when finished
const loadScript = (url, callback) => {
  let script = document.createElement("script"); // create script tag
  script.type = "text/javascript";

  // execute callback when script state is ready
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url; // load by url
  document.getElementsByTagName("head")[0].appendChild(script); // append to head
};

// when script is loaded, bind autocomplete to input element
const handleScriptLoad = (updateQuery, autoCompleteRef) => {

  // create and config autocomplete service
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: [], componentRestrictions: { country: "us" } }
  );
  autoComplete.setFields(["address_components", "formatted_address", "geometry"]);

  // add listener to populate the form UI when the place is selected
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

const handlePlaceSelect = async (updateQuery) => {
  const addressObject = autoComplete.getPlace(); // get place from google api
  if (addressObject && addressObject.address_components) updateQuery(addressObject);
}

const LocationInput = (props) => {

  const { state, dispatch } = useContext(Context);
  const [query, setQuery] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autoCompleteRef = useRef(null);

  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    postal_code: 'short_name'
  }

  useEffect(() => {
    if (!scriptLoaded) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_JS_API_KEY}&libraries=places`,
        () => {
          handleScriptLoad(updateLocation, autoCompleteRef)
          setScriptLoaded(true);
        }
      );
    }
  }, []);

  const updateLocation = (place) => {
    // https://developers.google.com/places/web-service/details
    // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
    setQuery(place.formatted_address)
    let newData = {}

    for (let component in componentForm) {
      document.getElementById(component).value = '';
      document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];

      // render new place in form UI
      if (componentForm[addressType]) {
        let val = place.address_components[i][componentForm[addressType]];

        switch (addressType) {
          case "street_number": newData.complement = val; break;
          case "route": newData.street = val; break;
          case "locality": newData.city = val; break;
          case "administrative_area_level_1": newData.state = val; break;
          case "postal_code": newData.zipcode = val; break;
          default: ; break;
        }
      }
    }

    // Get place lat and long coordinates from places
    newData.geo = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }

    state && state.auth && state.auth.isAuthenticated ?
      dispatch({ type: "UPDATE_LOCATION", location: newData }) :
      props.setLocation({ ...props.location, ...newData })
  }

  return (
    <div className="bg-light border my-4">
      <label className="input-group-text">Address</label>

      <div className="form-row my-2 px-2">

        <div className="col-12 my-2 border-bottom pb-4"> {/* Address input */}
          <input
            label="address"
            name="address"
            form="#prevent-global-submit-on-selection"
            className='form-control'
            ref={autoCompleteRef}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter a location to search"
            value={query}
          />
        </div>
        <div className="col-12 col-md-8"> {/* Street */}
          <label id="address">Street address</label>
          <input
            label="street"
            type="text"
            name="street"
            id="route"
            className='form-control'
            onChange={e => props.setLocation({ ...props.location(), [e.target.name]: e.target.value })}
            value={(props.location() && props.location().street) || ""}
          />
        </div>
        <div className="col-12 col-md-4 my-2 my-md-0"> {/* Complement */}
          <label id="complement">Complement</label>
          <input
            label="complement"
            type="text"
            name="complement"
            id="street_number"
            className='form-control'
            onChange={e => props.setLocation({ ...props.location(), [e.target.name]: e.target.value })}
            value={(props.location() && props.location().complement) || ""}
          />
        </div>

      </div>

      <div className="form-row my-2 px-2">

        <div className="form-group col-md-6"> {/* City */}
          <label htmlFor="inputCity">City</label>
          <input
            label="city"
            type="text"
            name="city"
            id="locality"
            className='form-control'
            onChange={e => props.setLocation({ ...props.location(), [e.target.name]: e.target.value })}
            value={(props.location() && props.location().city) || ""}
          />
        </div>
        <div className="form-group col-md-3"> {/* State */}
          <label htmlFor="inputState">State</label>
          <select
            label="state"
            type="text"
            name="state"
            id="administrative_area_level_1"
            className='form-control'
            onChange={e => props.setLocation({ ...props.location(), [e.target.name]: e.target.value })}
            value={(props.location() && props.location().state) || ""}
          >
            {Object.keys(location_state).map((state, index) => <option key={index}>{state}</option>)}
          </select>
        </div>
        <div className="form-group col-md-3"> {/* Zipcode */}
          <label htmlFor="inputZip">Zip code</label>
          <input
            label="zipcode"
            type="text"
            name="zipcode"
            id="postal_code"
            className="form-control"
            onChange={e => props.setLocation({ ...props.location(), [e.target.name]: e.target.value })}
            value={(props.location() && props.location().zipcode) || ""}
          />
        </div>

      </div>
    </div>
  )

}

export default LocationInput;