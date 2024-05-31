import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchAllUsers } from '../../utils/fetchAllUsers.component';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase.utils';

const UsersOnMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [radius, setRadius] = useState(10000); // Default radius 10km
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current authenticated user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);

        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error('Error getting location', error);
            // Default to London if geolocation fails
            setCurrentLocation([51.505, -0.09]);
          }
        );
      } else {
        setCurrentUserId(null);
        // Default to London if no authenticated user
        setCurrentLocation([51.505, -0.09]);
      }
    });

    // Fetch all users
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();

    return () => unsubscribe();
  }, []);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const usersWithinRadius = users.filter((user) => {
    const distance = calculateDistance(
      currentLocation?.[0],
      currentLocation?.[1],
      user.location.lat,
      user.location.lng
    );
    return distance <= radius / 1000;
  });

  const createPinMarkerIcon = (profilePictureUrl, isCurrentUser = false) => {
    const borderColor = isCurrentUser ? '#000000' : '#27ee35';
    const size = 50;

    const icon = L.divIcon({
      html: `
        <div style="border: 2px solid ${borderColor}; border-radius: 50%; width: ${size}px; height: ${size}px; overflow: hidden;">
          <img src="${profilePictureUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      `,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    return icon;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        <label htmlFor="radius" className="block mb-2 text-sm font-medium text-gray-700">
          Select Radius:
        </label>
        <select
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        >
          <option value={10000}>10 km</option>
          <option value={20000}>20 km</option>
          <option value={50000}>50 km</option>
          <option value={100000}>100 km</option>
        </select>
      </div>

      {currentLocation && (
        <MapContainer center={currentLocation} zoom={12} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVvYzEiLCJhIjoiY2x3dXR6dzRhMGg4NTJvcjF6czVhdmh6dSJ9.FF4J7ZYlfzcF3Bg60qComg`}
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
          />
          <Circle
            center={currentLocation}
            radius={radius}
            pathOptions={{ fillColor: 'rgba(0, 0, 255, 0.1)', color: 'orange', weight: 2 }}
          />
          {usersWithinRadius.map((user) => (
            <Marker
              key={user.uid}
              position={[user.location.lat, user.location.lng]}
              icon={createPinMarkerIcon(user.profilePictureUrl, user.uid === currentUserId)}
              eventHandlers={{
                click: () => navigate(`/profile/${user.uid}`),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                {user.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default UsersOnMap;
