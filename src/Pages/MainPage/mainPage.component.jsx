import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import PaginatedUserCarousel from "../../Components/paginatedCarousel.component";
import UserPanel from "../../Components/userPanel.component";
import UserFilterCarousel from "../../Components/userFilter.component";
import { fetchAllUsers } from '../../utils/fetchAllUsers.component';

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { users } = await fetchAllUsers();
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen relative bg-polar-sky">
      <button
        className="lg:hidden fixed top-4 left-4 p-2 bg-blue-500 text-white rounded-md z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <AiOutlineClose className="text-2xl" />
        ) : (
          <AiOutlineMenu className="text-2xl" />
        )}
      </button>
      <div
        className={`fixed lg:static top-0 left-0 h-full bg-polar-sky text-white shadow-xl transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 z-40`}
      >
        <UserPanel />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-4 mt-0">
        <UserFilterCarousel initialUsers={users} />
      </div>
    </div>
  );
};

export default MainPage;
