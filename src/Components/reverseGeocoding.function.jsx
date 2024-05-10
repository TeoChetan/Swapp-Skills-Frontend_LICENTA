const ReverseGeocodingData = async (lat, lng) => {
    const apiKey = 'AIzaSyCQRtyQ6iOxuM9A_ecJaqINRh5b0mE0zZs';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        return data.results[0].formatted_address;
      } else {
        throw new Error('Geocoding failed due to: ' + data.status);
      }
    } catch (error) {
      console.error('An error occurred during geocoding:', error);
      return null;
    }
  };

  export default ReverseGeocodingData;
  