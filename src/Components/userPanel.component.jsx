import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserData } from "../utils/fetchUserData.component";
import { AiOutlineHome, AiOutlineSearch, AiOutlineBell } from 'react-icons/ai';
import { MdOutlineMessage } from 'react-icons/md';
import { BsPerson } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const UserPanel = () => {
    const [user, setUser] = useState({
        profilePictureUrl: "defaultProfilePic.png",
        displayName: "",
        description: "",
        dateOfBirth: "",
        location: null,
        skillOwned: [],
    });
    const [userId, setUserId] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    const handleAuthStateChanged = useCallback(async (currentUser) => {
        if (currentUser) {
            try {
                const userDetails = await fetchUserData(currentUser.uid);
                setUser(prevState => {
                    if (JSON.stringify(prevState) !== JSON.stringify(userDetails)) {
                        return { ...prevState, ...userDetails };
                    }
                    return prevState;
                });
                setUserId(currentUser.uid);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        } else {
            console.log("No user is signed in.");
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
        return () => unsubscribe();
    }, [auth, handleAuthStateChanged]);

    return (
        <div className="flex flex-col items-start bg-blue-navy text-white w-32 md:w-40 lg:w-48 h-[750px]">
            <Icon icon={<AiOutlineHome />} label="Home" path="/swapp-skills" navigate={navigate} />
            <Icon icon={<AiOutlineSearch />} label="Map" path="/usersOnMap" navigate={navigate} />
            <Icon icon={<MdOutlineMessage />} label="Messages" path={`/messages/${userId}`} navigate={navigate} />
            <Icon icon={<AiOutlineBell />} label="Notifications" path="/notifications" navigate={navigate} />
            <Icon icon={<BsPerson />} label="Profile" path={`/profile/${userId}`} navigate={navigate} />
        </div>
    );
};

const Icon = ({ icon, label, path, navigate }) => (
    <div
        className="flex items-center w-full px-5 mx-6 my-2 mt-2   py-3 group border border-white rounded text-3xl hover:bg-gray-200 hover:text-black m-1 hover:rounded cursor-pointer"
        onClick={() => navigate(path)}
    >
        <div className="text-3xl mr-3">{icon}</div>
        <span className="text-base flex-1 text-left">{label}</span>
    </div>
);

export default UserPanel;
