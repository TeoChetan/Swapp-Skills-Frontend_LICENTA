import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserData } from '../../utils/fetchUserData.component';
import { fetchUserProfiles } from '../../utils/fetchUserProfiles.component';
import { AiOutlineMessage } from 'react-icons/ai';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserData();
    } else {
      setError(new Error('Invalid userId'));
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const usersData = await fetchUserProfiles();
        setAllUsers(usersData);
      } catch (error) {
        setError(error);
      }
    };

    loadAllUsers();
  }, []);

  const handleStartChat = () => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error fetching data: {error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-blue-navy shadow-lg rounded-lg overflow-hidden p-8 mt-10">
      <div className="flex items-center mb-8">
        <div className="relative">
          <img
            src={user.profilePictureUrl || "defaultProfilePic.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />
        </div>
        <div className="ml-8 flex items-center">
          <div>
            <h2 className="text-4xl font-bold text-white">{user.fullName || "Anonymous"}</h2>
            <p className="text-white">{user.username}</p>
          </div>
          <button
            onClick={handleStartChat}
            className="ml-4 p-2 rounded-full bg-blue-500 hover:bg-blue-700 transition duration-300 ease-in-out"
            aria-label="Start chat with user"
          >
            <AiOutlineMessage className="text-white text-4xl" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-400">Basic Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-400">Full Name:</label>
              <p className="flex items-center text-white">
                {user.fullName || "Anonymous"}
              </p>
            </div>
            <div>
              <label className="block font-medium text-gray-400">Email Address:</label>
              {allUsers.map((user, index) => (
                userId === user.uid ? (
                  <p key={index} className="mb-2 text-white">
                    {user.email}
                  </p>
                ) : null
              ))}
            </div>
            <div>
              <label className="block font-medium text-gray-400">Location:</label>
              <p className="text-white">{user.location?.name || "Unknown location"}</p>
            </div>
            <div>
              <label className="block font-medium text-gray-400">Date of Birth:</label>
              <p className="text-white">{user.dateOfBirth || "Not specified"}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-400">Additional Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-400">Description:</label>
              <p className="text-white">{user.description || "No description available"}</p>
            </div>
            <div>
              <label className="block font-medium text-gray-400">Skills Owned:</label>
              <div className="flex flex-wrap">
                {user.skillOwned && user.skillOwned.length > 0 ? (
                  user.skillOwned.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-900 py-1 px-3 rounded-full text-lg m-1"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
