import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import UserPanel from "../../Components/userPanel.component";
import UserFilterCarousel from "../../Components/userFilter.component";
import { fetchAllUsers } from "../../utils/fetchAllUsers.component";
import FooterSocialComponent from "../../Layouts/footerSocials.component";
import { haversineDistance } from "../../utils/haversineDistance";
import { auth } from "../../utils/firebase.utils";
import { onAuthStateChanged } from "firebase/auth";

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDataResponse = await fetch(`http://localhost:8080/user/${user.uid}`);
        const userData = await userDataResponse.json();
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUsers = useCallback(async (page, limit) => {
    setLoading(true);
    try {
      const data = await fetchAllUsers(page, limit);

      const filteredUsers = data.users.filter(user => user.uid !== currentUser?.uid);

      console.log("Fetched users:", filteredUsers);

      setUsers(prevUsers => {
        const newUsers = filteredUsers.filter(user => !prevUsers.some(prevUser => prevUser.uid === user.uid));
        return [...prevUsers, ...newUsers];
      });
      setTotal(data.total - (currentUser ? 1 : 0)); // Subtracting one to account for the excluded current user
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUsers(page, limit);
    }
  }, [page, limit, loadUsers, currentUser]);

  const loadMoreUsers = () => {
    if (users.length < total) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const matchUsers = useCallback(() => {
    if (!currentUser || !currentUser.skills) return users;

    const maxDistance = 100;

    const matchedUsers = users.filter(user => {
      if (!user.location || !user.skills) return false;

      const distance = haversineDistance(
        currentUser.location.latitude,
        currentUser.location.longitude,
        user.location.latitude,
        user.location.longitude
      );

      const hasMatchingSkills = user.skills.some(skill => currentUser.skills.includes(skill));

      return distance <= maxDistance && hasMatchingSkills;
    });

    return matchedUsers;
  }, [users, currentUser]);

  const matchedUsers = matchUsers();

  console.log("Users in state:", users);
  console.log("Matched users:", matchedUsers);

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
          <UserFilterCarousel initialUsers={matchedUsers} />
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
