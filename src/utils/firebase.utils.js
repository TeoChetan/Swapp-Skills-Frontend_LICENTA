  import { initializeApp } from "firebase/app";
  import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    getIdToken,
    userAuth,
  } from "firebase/auth";
import {toast} from 'react-toastify'
import { useState,useEffect,useContext,createContext } from "react";
import { useNavigate } from "react-router-dom";

  const firebaseConfig = {
    apiKey: "AIzaSyCQRtyQ6iOxuM9A_ecJaqINRh5b0mE0zZs",
    authDomain: "swapskills-3477e.firebaseapp.com",
    projectId: "swapskills-3477e",
    storageBucket: "swapskills-3477e.appspot.com",
    messagingSenderId: "741724235759",
    appId: "1:741724235759:web:141c1e233441faebbcf81a",
    measurementId: "G-TYCW42XCEQ",
  };

  const firebaseApp = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(firebaseApp);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  export const auth = getAuth();

  export const signInWithGooglePopup = () =>
    signInWithPopup(auth, googleProvider);

//asta ii tot ce am adaugat
const CSRFTokenContext = createContext();

export const CSRFTokenProvider = ({ children }) => {
    const [csrfToken, setCSRFToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetToken = async () => {
            const token = await fetchCsrfToken();
            if (token) {
                setCSRFToken(token);
                setLoading(false);
            } else {
                setLoading(true);
            }
        };

        fetchAndSetToken();
        
        
    }, []);

    if (loading) {
        return <div>Loading...</div>;  
    }

    return (
        <CSRFTokenContext.Provider value={csrfToken}>
            {children}
        </CSRFTokenContext.Provider>
    );
};

export const useCSRFToken = () => useContext(CSRFTokenContext);
    
//

  export const fetchCsrfToken = async () => {
    try {
      const csrfResponse = await fetch("http://localhost:8080/csrf",{
        credentials: "include",
      });
      const csrfData = await csrfResponse.json();
      return csrfData.token;
    } catch (error) {
      console.log("Error fetching csrf", error);
    }
  };

  export const createUserDocumentFromAuth = async (userAuth,additionalInformation={}) => {

    if(!userAuth) throw new Error('User Authentication must be provided');
    const csrfToken = await fetchCsrfToken();

    const user={
      uid: userAuth.uid,
      displayName: userAuth.displayName,
      email: userAuth.email,
      ...additionalInformation,
    }
    if (!user) throw new Error("User Authentification must be provided");

    console.log(user);
    // const idToken = await getIdToken(user);
    // console.log(idToken);




    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        if (response.status === 500) {
          toast.error("Email already in use. Please try another email or Sign In",{className:"toast-error-message"});
        }
        throw new Error("Failed to create user doc");
      }

      const data = await response.json();
      console.log(data);
      
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error("Failed to create user doc");
    }
  };

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password)
      throw new Error("Email and password must be provided");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  };

  export const createUserWithGoogleAuth = async (naviagate) => {
    try{
      const { user } = await signInWithGooglePopup();
      await createUserDocumentFromAuth(user);
      console.log("user created succesfully", user);
      naviagate("dashboard")
    }catch(error){
      console.log("User already exists. Please Sign In!",error);
    }
    
  };

  export const handleSignUpWithGoogle = async () => {
    await createUserWithGoogleAuth();
  };

