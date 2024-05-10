import React from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import MapComponent from "../../Components/map.component";
import { useCSRFToken} from "../../utils/firebase.utils";
import ReverseGeocodingData from "../../Components/reverseGeocoding.function";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const UserAccountPage = () => {
  const [user, setUser] = useState({
    profilePictureUrl: "defaultProfilePic.png",
    displayName: "",
    description: "",
    dateOfBirth: "",
    location: null,
    skillOwned: [],
  });
  const auth = getAuth();
  const csrfToken = useCSRFToken();
  const [initialUserData, setInitialUserData] = useState(null);
  const navigateTo = useNavigate();
  const handleLocationSelect = async(selectedLocation) => {
    const locationName = await ReverseGeocodingData(selectedLocation.lat,selectedLocation.lng);

    if (selectedLocation.lat && selectedLocation.lng) {
      setUser((prevUser) => ({
        ...prevUser,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          name:locationName
        },
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user details");
      const userData = await response.json();
      setUser({
        ...userData,
        location: userData.location || null,
      });
      setInitialUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data.");
    }
  };

  const handleDiscard = () => {
    setUser(initialUserData);
  };
  console.log(user);
  console.log(user.location);
  console.log(user.uid)
  const userId = user.uid;


  const handleUpdateInfo = async () => {
    try {
        const response = await fetch(`http://localhost:8080/userDetails/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(user),
            credentials: 'include'

        });

        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast.success("User information updated successfully!");
        window.location.reload();
        
    } catch (error) {
        console.error("Error updating user data:", error);
        toast.success("Failed to update user information.");
    }
};


  return (
    <div className="bg-black text-white min-h-screen flex flex-col lg:flex-row">
    <div className="flex flex-col items-center lg:items-start lg:w-1/4 p-6 border-r border-gray-800">
    <div className="avatar mb-4 flex flex-col sm:flex-row items-center sm:items-start">
      <div className="rounded-full w-24 h-24 bg-gray-700 flex items-center justify-center">
        <img
          src={user.profilePictureUrl || "defaultProfilePic.png"}
          alt="Profile Pic"
          className="rounded-full w-24 h-24"
        />
      </div>
      <h3 className="pt-8 text-center sm:text-left text-xl  sm:mt-0 sm:ml-4">{user.fullName || 'User Name'}</h3>
    </div>

        <h3 className="text-2xl font-semibold">{}</h3>
        <div className="flex justify-between w-full mt-2"></div>
        <div className=" flex flex-col mt-6 w-full">
          <button className="py-2 border-b border-gray-800">Messenger</button>
          <button className="py-2 border-b border-gray-800">My Account</button>
          <button className="py-2 border-b border-gray-800">
            Notifications
          </button>
        </div>
      </div>
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-4">Account</h2>
        <p className="mb-6">View and edit your personal info below.</p>
        <div className="space-y-4">
          <div className="form-section mb-6">
            <h3 className="text-xl font-semibold mb-2">Display info</h3>
            <p className="text-gray-400 text-sm mb-4">
              This information will be visible to all members of this site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                value={user.fullName || ""}
                onChange={handleInputChange}
                className="w-full p-2 bg-transparent border border-gray-600 rounded focus:border-gray-400"
                placeholder="Display name"
              />
            </div>
          </div>
          <div className="form-section mb-6">
            <h3 className="text-xl font-semibold mb-2">Personal info</h3>
            <p className="text-gray-400 text-sm mb-4">
              Update your personal information.
            </p>
            <div className="flex flex-col">
              <label className="my-2">Your current location: </label>
              <div className="my-2 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-2/4">
                <MapComponent
                  onChange={handleLocationSelect}
                  value={user.location}
                />
              </div>

              <label className="my-2">Description:</label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <textarea
                  type="text"
                  name="description"
                  value={user.description || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-transparent border border-gray-600 rounded focus:border-gray-400"
                  placeholder="Description"
                />
              </div>

              <label className="my-2">Date Of Birth:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <input
                  type="text"
                  name="dateOfBirth"
                  value={user.dateOfBirth || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-transparent border border-gray-600 rounded focus:border-gray-400"
                  placeholder="Date of birth"
                />
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-6">
            <h3 className="text-xl font-semibold mb-3">Skills</h3>
            <ul className="list-disc list-inside">
              {user.skillOwned.map((skill, index) => (
                <li key={index} className="ml-4 my-1">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 border border-gray-600 rounded hover:border-gray-500"
              onClick={handleDiscard}
            >
              Discard
            </button>
            <button className="px-4 py-2 bg-blue-navy rounded hover:bg-gray-500" onClick={handleUpdateInfo}>
              Update Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;