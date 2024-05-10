export const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const userData = await response.json();
      return userData; 
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; 
    }
  };
  