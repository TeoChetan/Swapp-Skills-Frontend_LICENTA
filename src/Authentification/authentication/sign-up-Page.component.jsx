import SignUpForm from "../sign-up-form/sign-up-form.component";
import { Link } from "react-router-dom";


const SignupPage = () => {
  return (
    <div className="bg-polar-sky flex justify-center h-full min-h-screen">
      <div className="authenticate-form bg-white flex flex-col lg:flex-row text-blue-nova rounded-xl w-full lg:w-4/6 lg:m-10 max-w-4xl m-auto lg:max-h-[700px] shadow-2xl ring-black ring-opacity-50 ">
        <div className="sign-in-content flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 lg:py-20 order-1 md:order-2">
          <h1 className="text-center font-bold text-xl sm:text-2xl lg:text-4xl mb-2 lg:mb-5">
            Create Account
          </h1>          
          <SignUpForm />
        </div>
        <div className="sign-in-image flex flex-col md:order-1 justify-center items-center bg-blue-navy rounded-b-none lg:rounded-l-xl lg:rounded-r-none  md:rounded-t-xl  p-8 lg:p-12 text-center shadow-lg">
          <h1 className="text-white font-bold text-2xl lg:text-3xl mb-4">
            Hello, Friend!
          </h1>
          <p className="text-white max-w-md text-base lg:text-lg">
            Enter your personal details and start your journey with SWAPP SKILLS
          </p>

          <Link className="text-white hover:text-gray-900 border border-polar-sky hover:border-black hover:scale-110 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-2xl text-sm text-center mt-5 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 px-10 py-2" to="/signin">Sign-in</Link>

        </div>
      </div>
    </div>
  );
};
export default SignupPage;
