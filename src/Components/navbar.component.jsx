import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Hamburger from "./hamburger.component";
import { useNavigate } from "react-router-dom";
import { ReactComponent as HomeLogo } from "../Assets/crown.svg";

const pages = [
    { name: "Home", path: "/swapp-skills" },
    { name: "Contact us", path: "/swapp-skills/contactUs" },
    { name: "About us", path:"/swapp-skills/aboutUs" },
  ];
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

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
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const navigateTo = (path)=>{
    navigate(path);
  }
  
  const listItems = pages.map((page, index) => (
    <li key={index} className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100 ">
      <button onClick={() => navigateTo(page.path)} className="text-white hover:text-black">{page.name}</button>
    </li>
  ));

  return (
    <div className="container relative m-auto p-5 flex justify-between items-center bg-black ">
      
    <div className="flex">
    <HomeLogo className="logo ml-4"></HomeLogo>
    <h1 className="text-xl font-bold text-gray-100 font-montserrat m-3">
      Swapp Skills
    </h1></div>

      <div className="flex items-center mr-10">
        <nav className={isOpen ? "flex" : "hidden md:flex"}>
          <ul className="flex bg-black flex-col md:flex-row w-full md:w-auto shadow md:shadow-none text-center md:text-right mr-10 ">
            {listItems}
          </ul>
        </nav>
        <div className="flex items-center">
          <svg
            onClick={() => alert("Notifications!")}
            className="cursor-pointer mr-4"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <div
            className="relative flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={user ? user.profilePictureUrl : "defaultProfilePic.png"}
              alt="Profile Pic"
              className="rounded-full w-8 h-8"
            />
            <svg
              className={`w-4 h-4 ml-1 transform transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="#fff"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isDropdownOpen && (
            <ul className="absolute right-0 w-48 mt-52 py-2 bg-white shadow-xl rounded-lg mr-10">
              <button className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>navigateTo("/swapp-skills/myAcount")}>
                My Account
              </button>
              <hr/>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Logout")}
              >
                Log-out
              </li>
            </ul>
          )}
        </div>
        <div className="md:hidden">
          <Hamburger></Hamburger>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
