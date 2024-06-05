import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [csrfToken, setCsrfToken] = useState(null);
  const auth = getAuth();

  const fetchCsrfToken = async () => {
    try {
      const csrfResponse = await fetch("http://localhost:8080/csrf", {
        credentials: "include",
      });
      const csrfData = await csrfResponse.json();
      setCsrfToken(csrfData.token);
    } catch (error) {
      console.error("Error fetching CSRF token", error);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  console.log(csrfToken)
  const fetchFavorites = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/favorites/${userId}`);
      const data = await response.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
      setFavorites([]);
    }
  }, []);

  const addToFavorites = useCallback(async (user) => {
    const userId = auth.currentUser.uid;
    const favoriteUserId = user.uid;

    if (!csrfToken) {
      console.error('CSRF token is not available');
      return;
    }

    try {
      await fetch('http://localhost:8080/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ userId, favoriteUserId }),
        credentials: 'include',
      });
      setFavorites((prevFavorites) => [...prevFavorites, user]);
    } catch (error) {
      console.error('Failed to add favorite', error);
    }
  }, [auth.currentUser, csrfToken]);

  const removeFromFavorites = useCallback(async (favoriteUserId) => {
    const userId = auth.currentUser.uid;

    if (!csrfToken) {
      console.error('CSRF token is not available');
      return;
    }

    try {
      await fetch(`http://localhost:8080/favorites?userId=${userId}&favoriteUserId=${favoriteUserId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
      });
      setFavorites((prevFavorites) => prevFavorites.filter((user) => user.uid !== favoriteUserId));
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  }, [auth.currentUser, csrfToken]);


  const isFavorite = useCallback((userId) => {
    return favorites.some((user) => user.uid === userId);
  }, [favorites]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchFavorites(auth.currentUser.userId);
    }
  }, [auth.currentUser, fetchFavorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
