import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import MapComponent from "../../Components/map.component";
import { useCSRFToken } from "../../utils/firebase.utils";
import ReverseGeocodingData from "../../Components/reverseGeocoding.function";
import { toast } from "react-toastify";

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
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLocationSelect = async (selectedLocation) => {
    const locationName = await ReverseGeocodingData(
      selectedLocation.lat,
      selectedLocation.lng
    );

    if (selectedLocation.lat && selectedLocation.lng) {
      setUser((prevUser) => ({
        ...prevUser,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          name: locationName,
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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file && user.uid) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("uid", user.uid);

        const response = await fetch(`http://localhost:8080/upload`, {
          method: "POST",
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const imageUrl = await response.text();
        setUser((prevUser) => ({
          ...prevUser,
          profilePictureUrl: imageUrl,
        }));

        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to upload profile picture.");
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
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
  }, [auth]);

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
      toast.error("Failed to load user data.");
    }
  };

  const handleDiscard = () => {
    setUser(initialUserData);
  };

  const handleUpdateInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/userDetails/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success("User information updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user information.");
    }
  };

  const goToMessenger = () => {
    navigate(`/messages/${user.uid}`);
  };

  const goToProfile = () => {
    navigate(`/profile/${user.uid}`);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col lg:flex-row">
      <div className="flex flex-col items-center lg:items-start lg:w-1/4 p-6 border-r border-gray-800">
        <div className="avatar mb-4 flex flex-col sm:flex-row items-center sm:items-start relative">
          <div
            className="rounded-full w-24 h-24 bg-gray-700 flex items-center justify-center cursor-pointer relative"
            onClick={handleImageClick}
          >
            <img
              src={user.profilePictureUrl || "defaultProfilePic.png"}
              alt="Profile Pic"
              className="rounded-full w-24 h-24"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-gray-300 font-semibold">Edit</span>
            </div>
          </div>
          <h3 className="pt-8 text-center sm:text-left text-xl sm:mt-0 sm:ml-4">
            {user.fullName || "User Name"}
          </h3>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            className="hidden"
          />
        </div>
        <div className="flex flex-col mt-6 w-full">
          <button className="py-2 border-b border-gray-800" onClick={goToMessenger}>Messenger</button>
          <button className="py-2 border-b border-gray-800" onClick={goToProfile}>My Profile</button>
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
            <button
              className="px-4 py-2 bg-blue-navy rounded hover:bg-gray-500"
              onClick={handleUpdateInfo}
            >
              Update Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
