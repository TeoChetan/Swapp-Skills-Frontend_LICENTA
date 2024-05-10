import React, { useState } from "react";
import { fetchUserData } from "../utils/fetchUserData.component";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserCard = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const auth = getAuth();

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

  console.log(user);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
    <div className="sm:max-w-sm md:w-max lg:w-max rounded-lg  shadow-lg bg-white text-center">
      <div className="bg-blue-nova p-4">
        <div className="avatar mb-4">
          <div className="rounded-full w-24 h-24 overflow-hidden mx-auto border border-black">
            <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white">{user.fullName}</h2>
        <p className="text-sm sm:text-base text-white">{user.location.name}</p>
        <p className="text-white font-semibold">UI/UX designer and front-end developer</p>
        <div className="my-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Message
          </button>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-2">
            Info
          </button>
        </div>
      </div>
      <div className="px-6 py-4 bg-white">
        <h3 className="font-bold text-xl text-black mb-2">SKILLS</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
       
        </div>
      </div>
    </div>
  </div>
  );
};

export default UserCard;
