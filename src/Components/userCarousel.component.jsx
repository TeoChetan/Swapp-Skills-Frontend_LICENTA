import { useState,useEffect } from "react";
import {Swiper,SwiperSlide} from "swiper/react";
import UserCard from "./userCard.component";

const UserCarousel = () => {
    const [users, setUsers] = useState([]); 
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:8080/users');  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const usersData = await response.json();
          setUsers(usersData);
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      };
  
      fetchUsers();
    }, []);

    console.log(users)
  
    return (
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {users.map((user, index) => (
          <SwiperSlide key={index}>
            <UserCard user={user} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };
  
  export default UserCarousel;
  