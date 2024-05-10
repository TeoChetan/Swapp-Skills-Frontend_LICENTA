import { Link } from "react-router-dom";
import {ReactComponent as GoogleLogo} from "../../Assets/google.svg"
import Button from "../../Components/button.component";
import {handleSignUpWithGoogle} from "../../utils/firebase.utils"
import SignInForm from "../sign-in-form/sign-in-form.component";

const SignInPage = () => {
  return (
    <div className="bg-polar-sky flex justify-center h-full min-h-screen">
      <div className="authenticate-form bg-white flex flex-col lg:flex-row text-blue-nova rounded-xl w-full lg:w-4/6 lg:m-10 max-w-4xl m-auto lg:max-h-[700px] shadow-2xl ring-black ring-opacity-50 ">
        <div className="sign-in-content flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 lg:py-20 order-1 md:order-2">
          <h1 className="text-center font-bold text-xl sm:text-2xl lg:text-4xl mb-2 lg:mb-5">
            Sign into account
          </h1>
          <Button onClick={handleSignUpWithGoogle} >
          <GoogleLogo className="w-10 h-10 "></GoogleLogo>
          <p className="m-2 text-black ">Sign-in with Google</p>
          </Button>
            <SignInForm/>
          </div>
        <div className="sign-in-image flex flex-col md:order-1 justify-center items-center bg-blue-navy  rounded-b-none lg:rounded-l-xl lg:rounded-r-none  md:rounded-t-xl  p-8 lg:p-12 text-center shadow-lg">
          <h1 className="text-white font-bold text-2xl lg:text-3xl mb-4">
            Welcome back!
          </h1>
          <p className="text-white max-w-md text-base lg:text-lg">
             Your journey continues here. Enter your credentials to access your account and explore THE world of SWAPP SKILLS</p>
          <Link className="text-white hover:text-gray-900 border border-polar-sky hover:border-black hover:scale-110 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-2xl text-sm text-center mt-5 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 px-10 py-2" to="/signup">Sign-up</Link>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
