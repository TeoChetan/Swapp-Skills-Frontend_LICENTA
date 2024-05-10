import { useState } from "react";
import {
  auth,
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button from "../../Components/button.component";
import { Link, useNavigate } from "react-router-dom";
import { reload, sendEmailVerification } from "firebase/auth";
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

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const [isSendingVerificationSent, setIsSendingEmailVerificationSent] =
    useState(false);
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  let navigate = useNavigate();


  const signUpUser = async (email, password, displayName) => {
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      console.log("before sending email", auth.currentUser);
      await sendEmailVerification(user);
      toast.success("Verification email sent. Please check your email.", {
        className: "toast-error-message",
      });
      setIsSendingEmailVerificationSent(true);


      try {
        const checkEmailVerified = setInterval(async () => {
          await reload(user);
          if (user.emailVerified) {
            try{
            console.log("Email verified!");
            clearInterval(checkEmailVerified);
            setIsSendingEmailVerificationSent(false);
            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
            navigate("/signin")
            }catch(error){
              console.error("Failed to create user Document")
            }
          }
        }, 10000);
      } catch (error) {
        setIsSendingEmailVerificationSent(false);
        toast.error("Email already Signed Up. Please try with another email or Sign In.",{className:"toast-error-message"})
        resetFormFields();
        throw new Error("Failed to create User");

      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Unable to sign up, email already in use", {
          className: "toast-error-message",
        });
        resetFormFields();
      } else if (error.code === "auth/weak-password") {
        toast.error("Weak Password. Please try atleast 6 characters", {
          className: "toast-error-message",
        });
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email", { className: "toast-error-message" });
      } else {
        console.log("An unexpected error occured.Pleasy try again", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match !", {
        className: "toast-error-message",
      });
      return;
    }

    try {
      await signUpUser(email, password, displayName);
    } catch (error) {
      console.log("error during signing in");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-up-container text-xl p-20 pt-5">
      {isSendingVerificationSent && <Spinner />}
      <span className="text-sm flex justify-center ">
        Sign-up with email and password
      </span>
      <form onSubmit={handleSubmit}>
        <ToastContainer />
        <FormInput
          inputOptions={{
            type: "text",
            required: true,
            onChange: handleChange,
            name: "displayName",
            value: displayName,
            placeholder: "Name",
          }}
        />

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

        <FormInput
          //label="Confirm Password"
          inputOptions={{
            type: "password",
            required: true,
            onChange: handleChange,
            name: "confirmPassword",
            value: confirmPassword,
            placeholder: "Confirm Password",
          }}
        />
        <div className="flex flex-col items-center justify-between ">
          <Button>Sign-up</Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;

// export const verifyEmail = async (idToken, csrfToken,requestBody) => {
//   const response = await fetch("http://localhost:8080/verify-email", {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRF-TOKEN": csrfToken,
//     },
//     body: JSON.stringify(requestBody),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText);
//   }else{
//   console.log("Email verified")
//   return response.json();
//   }
// };
