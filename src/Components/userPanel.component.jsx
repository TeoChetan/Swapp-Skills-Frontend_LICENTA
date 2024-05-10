import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserData } from "../utils/fetchUserData.component";
import { AiOutlineHome, AiOutlineSearch, AiOutlineBell } from 'react-icons/ai';
import { MdOutlineExplore, MdOutlineVideoLibrary, MdOutlineMessage } from 'react-icons/md';
import { IoCreateOutline } from 'react-icons/io5';
import { BsPerson } from 'react-icons/bs';

export const UserPanel = () => {
    const [user, setUser] = useState({
        profilePictureUrl: "defaultProfilePic.png",
        displayName: "",
        description: "",
        dateOfBirth: "",
        location: null,
        skillOwned: [],
    });
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDetails = await fetchUserData(currentUser.uid);
                    setUser(prevState => ({ ...prevState, ...userDetails }));
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            } else {
                console.log("No user is signed in.");
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col items-start bg-white text-black w-32 md:w-40 lg:w-48 h-full ">
        <Icon icon={<AiOutlineHome />} label="Home" />
        <Icon icon={<AiOutlineSearch />} label="Search" />
        <Icon icon={<MdOutlineMessage />} label="Messages" />
        <Icon icon={<AiOutlineBell />} label="Notifications" />
        <Icon icon={<BsPerson />} label="Profile" />
    </div>
    
    );
};

const Icon = ({ icon, label }) => (
    <div className="flex items-center w-full px-4 py-3  group text-3xl hover:bg-gray-300 m-1 hover:rounded ">
        <div className="text-3xl mr-3">{icon}</div>
        <span className="text-base flex-1 text-left">{label}</span>
    </div>
);


export default UserPanel;
