import React, { useState, useEffect, useMemo, useCallback } from 'react';
import UserCarousel from './carousel.component';
import { AiOutlineSearch } from 'react-icons/ai';

const deduplicateUsers = (users) => {
  const uniqueUsers = [];
  const userIds = new Set();

  users.forEach(user => {
    if (!userIds.has(user.uid)) {
      uniqueUsers.push(user);
      userIds.add(user.uid);
    }
  });
  return uniqueUsers;
};

const UserFilterCarousel = ({ initialUsers = [] }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(deduplicateUsers(initialUsers));

  const stableInitialUsers = useMemo(() => deduplicateUsers(initialUsers), [initialUsers]);

  const handleSearchChange = useCallback((e) => {
    setSearchFilter(e.target.value);
  }, []);

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
      <div className="flex items-center border border-blue-navy rounded overflow-hidden text-black">
        <Icon icon={<AiOutlineSearch />} />
        <input
          type="text"
          placeholder="Search by location, name, or skills..."
          value={searchFilter}
          onChange={handleSearchChange}
          className="flex-grow p-2 focus:outline-none bg-transparent border border-black m-2"
        />
      </div>
      <UserCarousel users={filteredUsers} />
    </div>
  );
};

const Icon = ({ icon }) => (
  <div className="flex items-center px-4 py-3 text-3xl group">
    <div className="text-3xl mr-2">{icon}</div>
  </div>
);

export default UserFilterCarousel;
