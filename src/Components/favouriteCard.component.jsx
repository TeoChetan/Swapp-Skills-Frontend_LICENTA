import React from 'react';
import { AiFillHeart, AiOutlineMessage } from 'react-icons/ai';
import { useFavorites } from './favorites.context';
import { useNavigate } from 'react-router-dom';

const FavoriteCard = ({ user }) => {
  const { removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleRemove = () => {
    removeFromFavorites(user.uid);
  };

  const openChat = () => {
    navigate(`/messages/${user.uid}`);
  };

  return (
    <div className="flex items-center justify-between bg-blue-navy text-white p-4 rounded-lg shadow-md my-2">
      <div className="flex items-center">
        <img
          src={user.profilePictureUrl || "defaultProfilePic.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="text-xl font-semibold">{user.fullName}</div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={handleRemove} className="text-red-500">
          <AiFillHeart className="text-2xl" />
        </button>
        <button onClick={openChat} className="text-white">
          <AiOutlineMessage className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default FavoriteCard;
