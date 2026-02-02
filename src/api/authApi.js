import { storage } from "../util/storage";
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
    try {
      // Call logout endpoint
      await apiClient.post('/users/logout');
    } catch (error) {
      // Log error but continue to clear local storage
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage, even if API call fails
      await storage.clearAll();
    }
    return true;
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      const response = await apiClient.post('/users/logoutAll');
      return response.data;
    } catch (error) {
      console.error('LogoutAll API call failed:', error);
      throw error;
    } finally {
      // Clear local storage even if API call fails
      await storage.clearAll();
    }
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
}