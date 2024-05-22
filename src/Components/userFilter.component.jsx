import React, { useState, useEffect, useMemo, useCallback } from 'react';
import UserCarousel from './carousel.component';
import { AiOutlineSearch } from 'react-icons/ai';

const UserFilterCarousel = ({ initialUsers = [] }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);

  // Memoize initialUsers to ensure it doesn't change between renders
  const stableInitialUsers = useMemo(() => initialUsers, [initialUsers]);

  // Use useCallback to memoize the input change handler
  const handleSearchChange = useCallback((e) => {
    setSearchFilter(e.target.value);
  }, []);

  // Memoize the filtered users list to avoid unnecessary re-renders
  const filteredUsersMemo = useMemo(() => {
    if (searchFilter === '') {
      return stableInitialUsers;
    }

    const searchLower = searchFilter.toLowerCase();

    return stableInitialUsers.filter(user => {
      const matchesLocation = user.location.name.toLowerCase().includes(searchLower);
      const matchesName = user.fullName.toLowerCase().includes(searchLower);
      const matchesSkills = user.skillOwned.some(skill => skill.toLowerCase().includes(searchLower));
      return matchesLocation || matchesName || matchesSkills;
    });
  }, [searchFilter, stableInitialUsers]);

  useEffect(() => {
    setFilteredUsers(filteredUsersMemo);
  }, [filteredUsersMemo]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="flex items-center border rounded overflow-hidden">
        <Icon icon={<AiOutlineSearch />} />
        <input
          type="text"
          placeholder="Search by location, name, or skills..."
          value={searchFilter}
          onChange={handleSearchChange}
          className="flex-grow p-2 focus:outline-none"
        />
      </div>
      <UserCarousel users={filteredUsers} />
    </div>
  );
};

const Icon = ({ icon }) => (
  <div className="flex items-center px-4 py-3 text-3xl group hover:bg-white hover:rounded">
    <div className="text-3xl mr-3">{icon}</div>
  </div>
);

export default UserFilterCarousel;
