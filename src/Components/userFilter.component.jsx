import React, { useState, useEffect, useMemo } from 'react';
import UserCarousel from './carousel.component';
import { AiOutlineSearch } from 'react-icons/ai';

const UserFilterCarousel = ({ initialUsers = [] }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);

  // Memoize initialUsers to ensure it doesn't change between renders
  const stableInitialUsers = useMemo(() => initialUsers, [initialUsers]);

  useEffect(() => {
    const filterUsers = () => {
      const filtered = stableInitialUsers.filter(user => {
        const searchLower = searchFilter.toLowerCase();
        const matchesLocation = user.location.name.toLowerCase().includes(searchLower);
        const matchesName = user.fullName.toLowerCase().includes(searchLower);
        const matchesSkills = user.skillOwned.some(skill => skill.toLowerCase().includes(searchLower));
        return matchesLocation || matchesName || matchesSkills;
      });
      setFilteredUsers(filtered);
    };

    if (searchFilter === '') {
      setFilteredUsers(stableInitialUsers);
    } else {
      filterUsers();
    }
  }, [searchFilter, stableInitialUsers]); 

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="flex items-center border rounded overflow-hidden">
        <Icon icon={<AiOutlineSearch />} />
        <input
          type="text"
          placeholder="Search by location, name, or skills..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
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
