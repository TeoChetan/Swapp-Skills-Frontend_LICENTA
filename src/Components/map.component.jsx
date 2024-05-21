  import React, { useState, useCallback, useRef } from "react";
  import {
    GoogleMap,
    Marker,
    StandaloneSearchBox,
  } from "@react-google-maps/api";
  import { toast } from "react-toastify";
  import { debounce } from "lodash";
  import { useEffect } from "react";

  const containerStyle = {
    width: "100%",
    height: "350px",
  };

  const defaultCenter = {
    lat: 46.770439,
    lng: 23.591423,
  };


  const MapComponent = ({ onChange,value }) => {
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const searchBoxRef = useRef(null);

    const onLoad = useCallback((ref) => {
      searchBoxRef.current = ref;
    }, []);

    useEffect(() => {
      if (value) {
        setMapCenter(value);
        setSelectedLocation(value);
      }
    }, [value]);

    const onPlacesChanged = useCallback(() => {
      const places = searchBoxRef.current.getPlaces();
      if (!places || places.length === 0) {
        toast.error("No locations found. Try a different query.");
        return;
      }
      const location = places[0].geometry.location;
      const newLocation = {
        lat: location.lat(),
        lng: location.lng(),
      };
      setMapCenter(newLocation);
      setSelectedLocation(newLocation); 
      onChange(newLocation);
    }, [onChange]);


    

    const debouncedPlacesChanged = debounce(onPlacesChanged, 300);

    return (
          <>
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={debouncedPlacesChanged}
            >
              <input
                required
                type="text"
                placeholder="Enter a location"
                className="form-control bg-transparent placeholder-gray-600 border border-gray-600 p-3 w-full"
                aria-label="Search for a location"
              />
            </StandaloneSearchBox>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={10}
            >
              {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
          </>
        );
      };
    

  export default MapComponent;


