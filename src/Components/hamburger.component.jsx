import React, { useState } from "react";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-blue-500">
      <nav className="relative px-4 py-4 flex justify-between items-center bg-black">
        <a href="#" className="text-3xl font-bold leading-none">
        </a>
        <div className="lg:hidden">
          <button
            className="navbar-burger flex items-center text-gray-600 p-3"
            onClick={toggleMenu}
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="navbar-menu relative z-50">
          <div
            className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-50"
            onClick={toggleMenu}
          ></div>
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center mb-8">
              <a href="#" className="mr-auto text-3xl font-bold leading-none">
              </a>
              <button className="navbar-close" onClick={toggleMenu}>
                <svg
                  className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <ul>
              <li className="mb-1">
                <a
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  href="/swapp-skills"
                >
                  Home
                </a>
                <a
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  href="/swapp-skills/contactUs"
                >
                  Contact Us
                </a>
                <a
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  href="/swapp-skills/aboutUs"
                >
                  About us
                </a>
              </li>
            </ul>
            <div className="mt-auto">
              <a
                className="block p-4 text-sm font-semibold text-red-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                href="#"
              >
                Log-out
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Hamburger;
