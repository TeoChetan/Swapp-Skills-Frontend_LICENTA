import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import UserPanel from "../../Components/userPanel.component";
import UserFilterCarousel from "../../Components/userFilter.component";
import { fetchAllUsers } from "../../utils/fetchAllUsers.component";
import FooterSocialComponent from "../../Layouts/footerSocials.component";

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const loadUsers = useCallback(async (page, limit) => {
    setLoading(true);
    try {
      const data = await fetchAllUsers(page, limit);
      console.log("Fetched users:", data.users);
      setUsers(prevUsers => {
        const newUsers = data.users.filter(user => !prevUsers.some(prevUser => prevUser.uid === user.uid));
        return [...prevUsers, ...newUsers];
      });
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(page, limit);
  }, [page, limit, loadUsers]);

  const loadMoreUsers = () => {
    if (users.length < total) {
      setPage(prevPage => prevPage + 1);
    }
  };

  console.log("Users in state:", users);

  return (
    <div>
      <div className="flex w-full min-h-screen bg-polar-sky">
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
          className={`fixed lg:static top-0 left-0 h-full bg-blue-navy text-white shadow-xl transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 w-64 z-40`}
        >
          <UserPanel />
        </div>
        <div className="flex-1 flex flex-col justify-start items-center p-4 mt-0">
          <UserFilterCarousel initialUsers={users} />
          {loading && <p>Loading...</p>}
          {!loading && users.length < total && (
            <button onClick={loadMoreUsers} className="mt-4 p-2 bg-blue-500 text-white rounded">
              Load More
            </button>
          )}
        </div>
      </div>
      <FooterSocialComponent />
    </div>
  );
};

export default MainPage;
