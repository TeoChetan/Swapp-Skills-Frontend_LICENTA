import React, { useState } from "react";
import Button from "../../Components/button.component";
import WelcomeAboardPic from "../../Assets/WelcomeAboardPic4.jpg";
import Dropdown from "../../Components/dropdown.component";
import MapComponent from "../../Components/map.component";
import { CalendarComponent } from "../../Components/calendar.component";

const MultiStepContainer = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState();

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const DropdownOptions = [
    "Software Engineer",
    "Musician",
    "Designer",
    "Graphic Designer",
    "Chef",
    "Pianist",
    "Guitarist",
    "Singer",
    "Photographer",
    "Fitness Trainer",
    "Math",
    "Science",
    "Spanish Teacher",
    "English Teacher",
    "German Teacher",
  ];

  switch (step) {
    case 1:
      return (
        <div className="flex justify-center items-center m-4">
          <div className="relative bg-blue-nova text-white rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src={WelcomeAboardPic}
              className="rounded-t-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
            ></img>
            <div className="absolute top-10 left-0 right-0 bottom-50 flex justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10 ">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-blue-nova  mb-5 sm:mb-3 md:mb-4 text-center ">
                Welcome aboard!
              </h2>
              <div className="absolute top-0 left-10 w-10 h-10 lg:border-b-4 lg:border-r-4 md:border-b-2 md:border-r-2 border-blue-nova"></div>
              <div className="absolute bottom-0 right-10 w-10 h-10 lg:border-t-4 lg:border-l-4 md:border-t-2 md:border-l-2  border-blue-nova"></div>
            </div>
            <div className="bg-polar-sky p-4 sm:p-6 md:p-8 lg:p-10 text-blue-nova break-words ">
              <p className="mb-2 text-base sm:text-lg md:text-xl text-center  font-bold flex flex-row justify-center">
                We're glad to have you! Let's get you settled in!
              </p>
              <p className="text-center">
                We're going to need a couple of details about you.
              </p>
            </div>
            <div className="flex flex-col text-center bg-white rounded-b-lg p-4 sm:p-6 md:p-8">
              <p className="text-blue-nova mb-2 sm:mb-3 md:mb-4">
                Please click 'Continue' to get started.
              </p>
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-polar-sky text-gray-600">
          <form
            onSubmit={nextStep}
            className="w-full max-w-4xl p-6 bg-white bg-opacity-75 rounded-lg shadow-lg space-y-6"
          >
            <div className="text-center">
              <p className="text-lg text-gray-400">
                Please fill in the information below.
              </p>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1">
                <div className="mt-1">
                  <label className="block text-lg font-semibold mb-2">
                    Skill Owned:
                  </label>
                  <Dropdown options={DropdownOptions} />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 mt-4">
                    Select date of birth:
                  </label>
                  <CalendarComponent />
                </div>

                <div className="mt-4">
                  <label className="block text-lg font-semibold mb-2">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe yourself..."
                    name="description"
                    required
                    className="form-textarea placeholder-gary-600 bg-transparent text-gray-600 pl-2 block w-full h-72 border border-gray-600 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  ></textarea>
                </div>
              </div>

              <div className="flex-1">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Event Location:
                  </label>
                  <MapComponent onLocationSelect={handleLocationSelect} />
                </div>

                <div className="flex flex-col space-y-4 mt-4">
                  <label
                    htmlFor="file-upload"
                    className="block text-lg font-semibold mb-2"
                  >
                    Upload Event Photo:
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="file-input text-sm text-gray-700 file:bg-gray-300 file:border-none file:px-4 file:py-2 file:rounded-full file:text-gray-600 file:font-semibold hover:file:bg-blue-nova hover:file:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 bg-transparent border border-black animation-pulse text-gray-600 hover:scale-105 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-transparent border border-black animation-pulse text-gray-600 hover:scale-105 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );

    default:
      return null;
  }
};

export default MultiStepContainer;
