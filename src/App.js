import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/home.component";
import SignInPage from "./Authentification/authentication/sign-in-Page.component";
import SignupPage from "./Authentification/authentication/sign-up-Page.component";
import MultiStepContainer from "./Pages/Dashboard/multistep";
import { CSRFTokenProvider } from "./utils/firebase.utils";
import MainPage from "./Pages/MainPage/mainPage.component";
import AboutUsPage from "./Pages/AboutUsPage/aboutUs.component";
import ContactUsPage from "./Pages/ContactUsPage/contactUsPage.component";
import Layout from "./Layouts/layout.component";
import UserAccountPage from "./Pages/AccountPage/acountPage.component";
import { ToastContainer } from "react-toastify";
import MessagesPage from "./Pages/MessagesPage/messagePage.component";
import UserProfilePage from "./Pages/UserProfilePage/userProfilePage.component";
import UsersOnMap from "./Pages/MapPage/usersOnMap.component";
import FavoritesPage from "./Pages/FavouritePage/FavouritePage";
import { FavoritesProvider } from './Components/favorites.context';
import ForgotPasswordPage from './Authentification/forgot-password/forgot-password.component';
const App = () => {
  return (
    <FavoritesProvider>

    <CSRFTokenProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<MultiStepContainer />} />
            <Route path="/swapp-skills" element={<Layout><MainPage /></Layout>} />
            <Route path="/swapp-skills/aboutUs" element={<Layout><AboutUsPage /></Layout>} />
            <Route path="/swapp-skills/contactUs" element={<Layout><ContactUsPage /></Layout>} />
            <Route path="/swapp-skills/myAccount" element={<Layout><UserAccountPage /></Layout>} />
            <Route path="/messages/:chatUserId" element={<Layout><MessagesPage /></Layout>} />
            <Route path="/profile/:userId" element={<Layout><UserProfilePage /></Layout>} />
            <Route path="/usersOnMap" element={<Layout><UsersOnMap /></Layout>} />
            <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />

          </Routes>
    </CSRFTokenProvider>
    </FavoritesProvider>

  );
};

export default App;
