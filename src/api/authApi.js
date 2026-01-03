import apiClient from "./client";

export const authAPI = {
    register: async (fullname, email, password) => {
    const response = await apiClient.post('/users/register', {
      fullname,
      email,
      password,
    });
    return response.data;
  },
   login: async (email, password) => {
    const response = await apiClient.post('/users/login', {
      email,
      password,
    });
    return response.data;
  },
  logout: async () => {
     await apiClient.post('/users/logout');
    return true
  },

  // Logout from all devices
  logoutAll: async () => {
    const response = await apiClient.post('/users/logoutAll');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
}