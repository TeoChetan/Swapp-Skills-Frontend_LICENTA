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

  export const createUserWithGoogleAuth = async () => {
    try{
      const { user } = await signInWithGooglePopup();
      await createUserDocumentFromAuth(user);
      console.log("user created succesfully", user);
    }catch(error){
      console.log("User already exists. Please Sign In!",error);
    }
    
  };

  export const handleSignUpWithGoogle = async () => {
    await createUserWithGoogleAuth();
  };

//   export const waitForEmailVerification = async () => {
//     return new Promise((resolve, reject) => {
//       const auth = getAuth();
//         const unsubscribe = auth.onAuthStateChanged(user => {
//         if (user) {
//           console.log("ana are mere",user);
//           user.reload().then(() => {
//             if (user.emailVerified) {
//               console.log("Email has been verified");
//               resolve(user); 
//             } else {
//               console.log("Email not verified yet");
//             }
//           });
//         } else {
//           reject(new Error("No user signed in"));
//         }
//       });
//       setTimeout(()=>{
//         unsubscribe();
//         reject(new Error("Timeout waiting for email verification"));

//       },3000000)
      
//   });


// };
