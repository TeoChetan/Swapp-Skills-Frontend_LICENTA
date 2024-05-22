import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const Dropdown = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Only clear selected options if none of the current options are in the selected options
    if (selectedOptions.length > 0 && !options.some(option => selectedOptions.includes(option))) {
      setSelectedOptions([]);
    }
  }, [options, selectedOptions]);

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions, onChange]);

  const toggleDropdown = () => setIsOpen(prevIsOpen => !prevIsOpen);

  const handleOptionClick = (option) => {
    setSelectedOptions(prevSelectedOptions => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions;
      }      
      if (prevSelectedOptions.length >= 3) {
        toast.error("Max 3 skills permitted");
        return prevSelectedOptions;
      }
      return [...prevSelectedOptions, option];
    });
  };

  const removeOption = (option) => {
    setSelectedOptions(prevSelectedOptions =>
      prevSelectedOptions.filter(so => so !== option)
    );
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center mx-auto" ref={dropdownRef}>
      <div className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
        <div className="flex flex-col items-center relative">
          <div className="w-full">
            <div
              className="my-2 p-1 flex border border-gray-600 cursor-pointer"
              onClick={toggleDropdown}
              aria-expanded={isOpen}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
            >
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded bg-gray-200 border border-black"
                  >
                    {option}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option);
                      }}
                      className="ml-2"
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <span className="flex-1 p-1 px-2 text-gray-600">
                  Select an option
                </span>
              )}
              <span className="text-gray-500 w-8 py-1 pl-2 pr-1 flex items-center border-l border-gray-500">
                <svg
                  className="fill-current h-4 w-4 transform"
                  viewBox="0 0 20 20"
                  style={{ transform: isOpen ? "rotate(180deg)" : "" }}
                >
                  <path d="M5.707 7.293a1 1 0 011.414 0L10 10.172l2.879-2.879a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                </svg>
              </span>
            </div>
          </div>

          {isOpen && (
            <div className="absolute mt-20 bg-white shadow w-full max-h-select z-10 rounded">
              <div className="flex flex-col w-full overflow-y-auto h-64">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="cursor-pointer w-full border-gray-600 border hover:bg-gray-300 p-2"
                    onClick={() => handleOptionClick(option)}
                    role="option"
                    aria-selected={selectedOptions.includes(option)}
                    tabIndex="0"
                    onKeyDown={(e) => e.key === "Enter" && handleOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
