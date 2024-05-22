import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = {
  lat: 46.770439,
  lng: 23.591423,
};

const MapComponent = ({ onChange, value }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchBoxRef = useRef(null);

  const onLoad = useCallback((ref) => {
    searchBoxRef.current = ref;
  }, []);

  useEffect(() => {
    if (value && typeof value.lat === "number" && typeof value.lng === "number") {
      setMapCenter(value);
      setSelectedLocation(value);
    } else {
      setMapCenter(defaultCenter);
      setSelectedLocation(null);
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

  // Using debounce to limit the rate of onPlacesChanged calls
  const debouncedPlacesChanged = useCallback(debounce(onPlacesChanged, 300), [onPlacesChanged]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedPlacesChanged.cancel();
    };
  }, [debouncedPlacesChanged]);

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
