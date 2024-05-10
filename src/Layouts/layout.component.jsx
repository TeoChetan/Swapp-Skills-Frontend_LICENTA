import React from 'react';
import Navbar from '../Components/navbar.component';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
};

export default Layout;
