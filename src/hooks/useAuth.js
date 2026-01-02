// ==========================================
// 🔐 LOGIN MUTATION
// ==========================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
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

    onSuccess: async () => {
      console.log('✅ Logged out successfully');

      // Clear all stored data
      await storage.clearAll();

      // Clear all React Query cache
      queryClient.clear();
    },

    onError: async (error) => {
      console.log('❌ Logout error:', error);
      
      // Even if API fails, clear local data
      await storage.clearAll();
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
  const [localUser, setLocalUser] = React.useState(null);
  const [isLoadingLocal, setIsLoadingLocal] = React.useState(true);
  
  // Load user from storage immediately (fast)
  React.useEffect(() => {
    const loadUser = async () => {
      const savedUser = await storage.getUserData();
      setLocalUser(savedUser);
      setIsLoadingLocal(false);
    };
    loadUser();
  }, []);
  
  // Fetch fresh data from API in background
  const { data: freshUser, isLoading: isFetchingFresh } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authAPI.getProfile();
      await storage.saveUserData(response.user);
      setLocalUser(response.user);
      return response.user;
    },
    enabled: !!localUser, // Only fetch if we have a user in storage
    staleTime: 5 * 60 * 1000,
  });
  
  return {
    user: freshUser || localUser,
    isLoading: isLoadingLocal,
    isFetching: isFetchingFresh,
  };
};