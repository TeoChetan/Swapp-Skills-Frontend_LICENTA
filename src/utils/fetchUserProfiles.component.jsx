export const fetchUserProfiles = async () => {
    try {
      const response = await fetch('http://localhost:8080/usersProfiles');
      if (!response.ok) {
        throw new Error('Failed to fetch user profiles');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  