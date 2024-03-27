// export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
//     if (!userAuth) throw new Error("User Authentication must be provided");
  
//     // Define the user document reference
//     const userDocRef = {
//       uid: userAuth.uid,
//       displayName: userAuth.displayName,
//       email: userAuth.email,
//       ...additionalInformation,
//     };
  
//     try {
//       // Fetch the CSRF token from the backend
//       const csrfResponse = await fetch("http://localhost:8080/csrf", { credentials: 'include' });
//       const csrfData = await csrfResponse.json();
  
//       // Make the signup request with the CSRF token in the header
//       const signupResponse = await fetch('http://localhost:8080/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRF-TOKEN': csrfData.token, // Adjust the header name if necessary
//         },
//         credentials: 'include', // Include credentials if cookies are used
//         body: JSON.stringify(userDocRef),
//       });
  
//       if (!signupResponse.ok) {
//         throw new Error("Failed to create user document");
//       }
  
//       const data = await signupResponse.json();
//       console.log(data);
//     } catch (error) {
//       console.error("Error during user document creation", error);
//       throw new Error("Failed to create user document");
//     }
//   };
  