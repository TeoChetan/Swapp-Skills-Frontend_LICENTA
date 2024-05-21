// import React, { useState, useEffect } from 'react';
// import ReactPaginate from 'react-paginate';
// import UserCarousel from './carousel.component';
// import { fetchAllUsers } from '../utils/fetchAllUsers.component';

// const PaginatedUserCarousel = () => {
//   const [users, setUsers] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(0);
//   const USERS_PER_PAGE = 10;

//   useEffect(() => {
//     const loadUsers = async () => {
//       const { users, total } = await fetchAllUsers(currentPage, USERS_PER_PAGE);
//       setUsers(users);
//       setPageCount(Math.ceil(total / USERS_PER_PAGE));
//     };
//     loadUsers();
//   }, [currentPage]);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   return (
//     <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
//       <div className="flex items-center justify-center w-full">
//         <button 
//           onClick={() => setCurrentPage(currentPage - 1)}
//           disabled={currentPage === 0}
//           className="mx-2 px-3 py-1 border rounded-full text-white bg-blue-navy hover:bg-blue-nova transition-colors duration-200">
//           {'<'}
//         </button>

//         <UserCarousel users={users} />

//         <button 
//           onClick={() => setCurrentPage(currentPage + 1)}
//           disabled={currentPage === pageCount - 1}
//           className="lg:ml-64 px-3 py-1 border rounded-full text-white bg-blue-navy hover:bg-blue-nova transition-colors duration-200">
//           {'>'}
//         </button>
//       </div>

//       <ReactPaginate
//         previousLabel={'<'}
//         nextLabel={'>'}
//         breakLabel={'...'}
//         onPageChange={handlePageClick}
//         containerClassName={'pagination flex justify-center mt-8'}
//         pageClassName={'page-item mx-2'}
//         pageLinkClassName={'page-link px-3 py-1 border rounded-full text-white bg-blue-navy hover:bg-blue-nova transition-colors duration-200'}
//         previousClassName={'hidden'}
//         previousLinkClassName={'hidden'}
//         nextClassName={'hidden'}
//         nextLinkClassName={'hidden'}
//         breakClassName={'page-item mx-2'}
//         breakLinkClassName={'page-link px-3 py-1 border rounded-full text-gray-700'}
//         activeClassName={'active'}
//         activeLinkClassName={'bg-blue-500 text-white'}
//       />
//     </div>
//   );
// };

// export default PaginatedUserCarousel;
