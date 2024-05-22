import React, { useState, useEffect, useRef } from "react";
import Button from "../../Components/button.component";
import WelcomeAboardPic from "../../Assets/WelcomeAboardPic4.jpg";
import Dropdown from "../../Components/dropdown.component";
import MapComponent from "../../Components/map.component";
import { CalendarComponent } from "../../Components/calendar.component";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { useCSRFToken } from "../../utils/firebase.utils";
import { useNavigate } from "react-router-dom";
import ReverseGeocodingData from "../../Components/reverseGeocoding.function";

const MultiStepContainer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [description, setDescription] = useState("");
  const [fullName, setFullName] = useState("");
  const [skillOwned, setSkillOwned] = useState([]);
  const [file, setFile] = useState(null);
  const csrfToken = useCSRFToken();

  const [imageUrl, setImageUrl] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const controllerRef = useRef(null);

  const cleanUpAbortController = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  const handleLocationSelect = async (selectedLocation) => {
    const locationName = await ReverseGeocodingData(
      selectedLocation.lat,
      selectedLocation.lng
    );
    setLocation({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      name: locationName,
    });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDateOfBirth = dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : null;
    const userData = {
      uid: currentUser.uid,
      fullName: fullName,
      skillOwned: skillOwned,
      location: location,
      description: description,
      profilePictureUrl: imageUrl,
      dateOfBirth: formattedDateOfBirth,
    };

    if (!fullName || !skillOwned.length || !description || !dateOfBirth) {
      toast.error("Please fill in all required fields.");
      return;
    }

    cleanUpAbortController();
    controllerRef.current = new AbortController();

    try {
      const response = await fetch("http://localhost:8080/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(userData),
        credentials: "include",
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to submit user details");
      }
      const result = await response.json();
      console.log("Submitted user details:", result);
    } catch (error) {
      console.error("Error submitting user details:", error);
      toast.error("Failed to submit user details. Please try again.");
      return;
    }

    let uploadedImageUrl = null;

    if (file) {
      try {
        uploadedImageUrl = await handleFileUpload(file);
        if (uploadedImageUrl) {
          userData.profilePictureUrl = uploadedImageUrl;
          setImageUrl(uploadedImageUrl);
        }
      } catch (error) {
        console.error("Upload fail", error);
        return;
      }
    }

    navigate("/swapp-skills", { state: { userData: { ...userData, profilePictureUrl: uploadedImageUrl } } });
  };

  const handleFileUpload = async (file) => {
    const userId = currentUser ? currentUser.uid : null;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("uid", userId);

    cleanUpAbortController();
    controllerRef.current = new AbortController();

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: formData,
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to upload file");
      }

      const imageUrl = await response.text();
      setImageUrl(imageUrl);
      console.log("File uploaded:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error during file upload:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanUpAbortController(); // Ensure cleanup on component unmount
    };
  }, []);

  return (
    <div>
      {step === 1 && (
        <div className="flex justify-center items-center min-h-screen bg-[#00152c]">
          <ToastContainer />
          <div className="relative bg-blue-nova text-white rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src={WelcomeAboardPic}
              className="rounded-t-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
              alt="pic.png"
            />
            <div className="absolute top-10 left-0 right-0 bottom-50 flex justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-blue-nova mb-5 sm:mb-3 md:mb-4 text-center">
                Welcome aboard!
              </h2>
              <div className="absolute top-0 left-10 w-10 h-10 lg:border-b-4 lg:border-r-4 md:border-b-2 md:border-r-2 border-blue-nova"></div>
              <div className="absolute bottom-0 right-10 w-10 h-10 lg:border-t-4 lg:border-l-4 md:border-t-2 md:border-l-2 border-blue-nova"></div>
              </div>
              <div className="bg-polar-sky p-4 sm:p-6 md:p-8 lg:p-10 text-blue-nova break-words">
                <p className="mb-2 text-base sm:text-lg md:text-xl text-center font-bold flex flex-row justify-center">
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
        )}
        {step === 2 && (
          <div className="flex flex-col justify-center items-center min-h-screen bg-[#00152c] text-gray-900">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-4xl p-6 bg-white bg-opacity-100 rounded-lg shadow-lg space-y-6"
              id="formId"
            >
              <div className="text-center">
                <p className="text-lg text-gray-400">
                  Please fill in the information below.
                </p>
              </div>
  
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-1">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-lg font-semibold mb-2"
                    >
                      Please enter your name:
                    </label>
                    <input
                      id="fullName"
                      className="text-sm w-full bg-transparent text-gray-700 border border-gray-900 p-2 mb-6"
                      placeholder="Enter your name..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    ></input>
                  </div>
                  <div className="mt-1">
                    <label className="block text-lg font-semibold mb-2">
                      Skill Owned:
                    </label>
                    <Dropdown
                      options={DropdownOptions}
                      value={skillOwned}
                      onChange={setSkillOwned}
                    />
                  </div>
  
                  <div>
                    <label className="block text-lg font-semibold mb-2 mt-4">
                      Select date of birth:
                    </label>
                    <CalendarComponent
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-lg font-semibold mb-2"
                    >
                      Description:
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe yourself..."
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="form-textarea placeholder-gray-600 bg-transparent text-gray-900 pl-2 block w-full h-56 border border-gray-900 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    ></textarea>
                  </div>
                </div>
  
                <div className="flex-1">
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      Location:
                    </label>
                    <MapComponent
                      onChange={handleLocationSelect}
                      value={location}
                    />
                  </div>
  
                  <div className="flex flex-col space-y-4 mt-4">
                    <label
                      htmlFor="file-upload"
                      className="block text-lg font-semibold mb-2"
                    >
                      Upload Your Photo:
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="file-input text-sm text-gray-700 file:bg-gray-300 file:border-none file:px-4 file:py-2 file:rounded-full file:text-gray-900 file:font-semibold hover:file:bg-blue-navy hover:file:text-white"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                      }}
                    />
                  </div>
                </div>
              </div>
  
              <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-2 px-4 bg-transparent border border-black animation-pulse text-gray-900 hover:scale-105 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-transparent border border-black animation-pulse text-gray-900 hover:scale-105 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };
  
  export default MultiStepContainer;
  