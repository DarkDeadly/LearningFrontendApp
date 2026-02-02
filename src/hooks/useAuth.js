// ==========================================
// 🔐 LOGIN MUTATION
// ==========================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../api/authApi";
import { storage } from "../util/storage";
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await authAPI.login(email, password)
      return response
    },
    onSuccess: async (data) => {
      console.log('✅ Login successful:', data);
      // Save token and user data in parallel (faster)
      await Promise.all([
        storage.saveToken(data.accessToken),
        storage.saveUserData(data.user)
      ])
      // This forces useCurrentUser to see the new user immediately
      queryClient.setQueryData(['profile'], data.user);
      // Invalidate profile query to refetch fresh data

    },
    onError: (error) => {
      console.log('❌ Login failed:', error.response?.data?.message);
    },
  })
}
// ==========================================
// 📝 REGISTER MUTATION
// ==========================================
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fullname, email, password }) => {
      const response = await authAPI.register(fullname, email, password);
      return response;
    },

    onSuccess: async (data) => {
      console.log('✅ Registration successful:', data);
      // Save token and user data
      await Promise.all([
        storage.saveToken(data.accessToken),
        storage.saveUserData(data.user)
      ]);
      // This forces useCurrentUser to see the new user immediately
      queryClient.setQueryData(['profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });


    },

    onError: (error) => {
      console.log('❌ Registration failed:', error.response?.data?.message);
    },
  });
};
// ==========================================
// 🚪 LOGOUT MUTATION
// ==========================================
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: async () => {
      // Note: storage.clearAll() is already called in authAPI.logout()
      // No need to clear storage again here

      // 1. Set the user to null in the cache
      queryClient.setQueryData(['profile'], null);

      // 2. Remove the query entirely to stop observers
      queryClient.removeQueries({ queryKey: ['profile'] });

      // 3. Clear all cached queries
      queryClient.clear();
    },
  });
};
// ==========================================
// 🚪🚪 LOGOUT ALL DEVICES MUTATION
// ==========================================
export const useLogoutAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authAPI.logoutAll();
    },

    onSuccess: async () => {
      console.log('✅ Logged out from all devices');

      // Note: storage is already cleared in authAPI.logoutAll()
      queryClient.clear();
    },

    onError: async (error) => {
      console.log('❌ Logout all error:', error);

      // Note: storage is already cleared in authAPI.logoutAll()
      queryClient.clear();
    },
  });
};
// ==========================================
// 🎯 CUSTOM HOOK - Get Current User
// ==========================================
export const getStoredUser = async () => await storage.getUserData();
export const useCurrentUser = (preLoadedData) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authAPI.getProfile()
      await storage.saveUserData(response.user)
      return response.user
    },
    initialData: preLoadedData,
    staleTime: 5 * 60 * 1000,
  })
};

