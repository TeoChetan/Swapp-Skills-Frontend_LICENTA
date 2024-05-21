import { useNavigate } from 'react-router-dom';
import {
  AiOutlineMessage,
  AiOutlineUser,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineInfoCircle,
  AiOutlineEnvironment,
} from 'react-icons/ai';
import { useState } from 'react';

const UserCard = ({ user, currentUserId }) => {
  const history = useNavigate();
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const openChat = () => {
    history(`/messages/${user.uid}`);
  };

  const skills = user.skillOwned || [];
  const profilePictureUrl = user.profilePictureUrl || "defaultProfilePic.png";
  const fullName = user.fullName || "Anonymous";
  const locationName = user.location?.name || "Unknown location";

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
        <button onClick={() => (window.location.href = `/profile/${user.id}`)}>
          <AiOutlineUser className="text-4xl text-black" />
        </button>
        <button onClick={toggleLike}>
          {liked ? (
            <AiFillHeart className="text-4xl text-red-500" />
          ) : (
            <AiOutlineHeart className="text-4xl text-black" />
          )}
        </button>
        <button onClick={() => (window.location.href = `/info/${user.id}`)}>
          <AiOutlineInfoCircle className="text-4xl text-black" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
