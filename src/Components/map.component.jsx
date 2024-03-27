import React, { useState, useCallback,useRef } from 'react';
import { GoogleMap, LoadScript, Marker,StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 	46.770439,
  lng: 	23.591423,
};

const libraries = ["places"];
const MapComponent = () => {
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const searchBoxRef = useRef(null);
  
    const onLoad = useCallback((ref) => {
      searchBoxRef.current = ref;
    }, []);
  
    const onPlacesChanged = useCallback(() => {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const location = places[1].geometry.location;
        setMapCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setSelectedLocation({
          lat: location.lat(),
          lng: location.lng(),
        });
      }
    }, []);
  
    return (
      <LoadScript googleMapsApiKey="AIzaSyCQRtyQ6iOxuM9A_ecJaqINRh5b0mE0zZs" libraries={libraries}>
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Enter a location"
            className="form-control bg-transparent placeholder-gray-600 border border-gray-600 p-3 w-full"
          />
        </StandaloneSearchBox>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
      </LoadScript>
    );
  };
  
  export default MapComponent;