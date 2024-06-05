import React from 'react';
import { useFavorites} from '../../Components/favorites.context'
import FavoriteCard from '../../Components/favouriteCard.component';

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">My Favorite Users</h1>
      <div className="w-full max-w-lg">
        {favorites.map((user) => (
          <FavoriteCard key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
