export const fetchAllUsers = async (page = 0, limit = 10) => {
    try {
      const response = await fetch(`http://localhost:8080/users?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return { users: [], total: 0 };
    }
  };
  