import { useNavigate } from 'react-router-dom';
import {
  AiOutlineMessage,
  AiOutlineUser,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineInfoCircle,
  AiOutlineEnvironment,
} from 'react-icons/ai';
import { useState, useMemo, useCallback } from 'react';
import { useFavorites } from './favorites.context';
import { Tooltip } from 'react-tooltip';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const toggleLike = useCallback((e) => {
    e.stopPropagation();
    if (isFavorite(user.uid)) {
      removeFromFavorites(user.uid);
    } else {
      addToFavorites(user);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites, user]);

  const openChat = useCallback((e) => {
    e.stopPropagation();
    navigate(`/messages/${user.uid}`);
  }, [navigate, user.uid]);

  const viewProfile = useCallback((e) => {
    e.stopPropagation();
    navigate(`/profile/${user.uid}`);
  }, [navigate, user.uid]);



  const skills = useMemo(() => user.skillOwned || [], [user.skillOwned]);
  const profilePictureUrl = useMemo(() => user.profilePictureUrl || "defaultProfilePic.png", [user.profilePictureUrl]);
  const fullName = useMemo(() => user.fullName || "Anonymous", [user.fullName]);
  const locationName = useMemo(() => user.location?.name || "Unknown location", [user.location?.name]);

  return (
    <div className="lg:w-card lg:h-card max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden relative">
      <div
        className="w-full h-64 bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${profilePictureUrl})` }}
      />
      <div className="px-8 py-6 bg-white">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold text-black text-center">
            {fullName}
          </h2>
          <div className="flex items-center text-black text-sm">
            <AiOutlineEnvironment className="text-lg mr-2" />
            <p>{locationName}</p>
          </div>
        </div>

        <h3 className="font-bold text-xl text-black">Skills:</h3>
        <div className="flex flex-wrap justify-center">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-200 text-black py-1 px-2 rounded-full text-lg m-1"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={openChat}>
          <AiOutlineMessage className="text-4xl text-black" />
        </button>
        <button onClick={viewProfile}>
          <AiOutlineUser className="text-4xl text-black" />
        </button>
        <button onClick={toggleLike}>
          {isFavorite(user.uid) ? (
            <AiFillHeart className="text-4xl text-red-500" />
          ) : (
            <AiOutlineHeart className="text-4xl text-black" />
          )}
        </button>
        <button data-tooltip-id="infoTooltip" data-tooltip-content="Follow community guidelines for language use" >
          <AiOutlineInfoCircle className="text-4xl text-black " />
        </button>
        <Tooltip id="infoTooltip" place="top" effect="solid" />
      </div>
    </div>
  );
};

export default UserCard;
