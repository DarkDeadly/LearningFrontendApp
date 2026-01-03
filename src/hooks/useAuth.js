// ==========================================
// 🔐 LOGIN MUTATION
// ==========================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
    mutationFn: async () => {
      await authAPI.logout();
    },

    onSuccess: () => {
      console.log('✅ Logged out successfully');

      // CRITICAL: Force React Query to forget the user immediately
      queryClient.setQueryData(['profile'], null);

      // Also clear everything else
      storage.clearAll();
      queryClient.clear();
    },
    onError: (error) => {
      console.log('❌ Logout error:', error);

      // Same for error case
      queryClient.setQueryData(['profile'], null);
      storage.clearAll();
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

      await storage.clearAll();
      queryClient.clear();
    },

    onError: async (error) => {
      console.log('❌ Logout all error:', error);

      await storage.clearAll();
      queryClient.clear();
    },
  });
};

// ==========================================
// 👤 GET PROFILE QUERY
// ==========================================
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],

    queryFn: async () => {
      const response = await authAPI.getProfile();

      // Update stored user data with fresh data
      await storage.saveUserData(response.user);

      return response.user;
    },

    // Only fetch if we have a token
    enabled: false,  // We'll enable it manually when needed

    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
// ==========================================
// 🎯 CUSTOM HOOK - Get Current User
// ==========================================
export const useCurrentUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initial load: seed cache from storage
  useEffect(() => {
    const init = async () => {
      const savedUser = await storage.getUserData();
      if (savedUser) {
        queryClient.setQueryData(['profile'], savedUser);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const { data: user, isFetching } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authAPI.getProfile();
      await storage.saveUserData(response.user);
      return response.user;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isFetching
  };
};