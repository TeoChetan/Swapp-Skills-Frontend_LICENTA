import { useState } from "react";
import {
  auth,
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button from "../../Components/button.component";
import { Link, useNavigate } from "react-router-dom";
import {
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Spinner } from "../../Components/spinner.component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Assets/toast-custom.css";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not found.Please sign up first!");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password.Please try again!");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Email/Password do not match!", {
          className: "toast-error-message",
        });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signInUser(email, password);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    name === "email" ? setEmail(value) : setPassword(value);
  };

  return (
    <div className="sign-up-container text-xl p-20 pt-5">
      <span className="text-sm flex justify-center ">
        Sign-in with email and password
      </span>
      <form onSubmit={handleSubmit}>
        <ToastContainer />

        <FormInput
          inputOptions={{
            type: "email",
            required: true,
            onChange: handleChange,
            name: "email",
            value: email,
            placeholder: "you@example.com",
          }}
        />

        <FormInput
          //label="Password"
          inputOptions={{
            type: "password",
            required: true,
            onChange: handleChange,
            name: "password",
            value: password,
            placeholder: "Password",
          }}
        />

        <div className="flex flex-col items-center justify-between ">
          <Link className="text-sm" to="/forgotPassword">
            Forgot Password?
          </Link>
          <hr className="mt-2 border-gray-400 h-2 w-1/2 " />

          <Button>Sign-in</Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
