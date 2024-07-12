import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../utils/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button from "../../Components/button.component";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email address.");
      } else {
        toast.error("Failed to send password reset email. Please try again.");
      }
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mt-4">Forgot password?</h2>
          <span className="text-gray-400">Please enter your email</span>
        </div>
        <form onSubmit={handleSubmit}>
          <ToastContainer />

          <FormInput
            inputOptions={{
              type: "email",
              required: true,
              onChange: handleChange,
              name: "email",
              value: email,
              placeholder: "Email",
            }}
            className="w-full mb-4"
          />

          <Button className="w-full bg-blue-navy text-white py-2 mt-4 rounded-md">Recover password</Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
