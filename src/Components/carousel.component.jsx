import React, { useState } from 'react';
import UserCard from './userCard.component';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const UserCarousel = ({ users }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(users)

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? users.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === users.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <div className="overflow-hidden relative">
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {users.map((user, index) => (
            <div key={index} className="min-w-full flex justify-center items-center">
              <UserCard user={user} />
            </div>
          ))}
        </div>
      </div>
      <button className="absolute top-1/2 transform -translate-y-1/2 left-0 p-2 bg-gray-800 text-white " onClick={prevSlide}>
        <AiOutlineLeft className="text-2xl" />
      </button>
      <button className="absolute top-1/2 transform -translate-y-1/2 right-0 p-2 bg-gray-800 text-white" onClick={nextSlide}>
        <AiOutlineRight className="text-2xl" />
      </button>
    </div>
  );
};

export default UserCarousel;
