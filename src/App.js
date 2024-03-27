import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/home.component";
import SignInPage from "./Authentification/authentication/sign-in-Page.component";
import SignupPage from "./Authentification/authentication/sign-up-Page.component";
import MultiStepContainer from "./Pages/Dashboard/multistep";
const App = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignupPage/>}/>
        <Route path="signin" element={<SignInPage/>}></Route>
        <Route path='/dashboard' element={<MultiStepContainer/>}/>
      </Route>
    </Routes>
  );
};

export default App;
