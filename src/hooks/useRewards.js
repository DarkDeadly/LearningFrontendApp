import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RewardsApi } from "../api/rewardApi";


export const useGetClassRewards = (classroomId) => {
  return useQuery({
    queryKey: ['rewards', classroomId],
    queryFn: () => RewardsApi.classRewards(classroomId),
    enabled: !!classroomId, // Only fetch if we have an ID
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classroomId, payload }) => RewardsApi.create(classroomId, payload),
    onSuccess: (_, variables) => {
      // Refresh the rewards list automatically after creating a new one
      queryClient.invalidateQueries(['rewards', variables.classroomId]);
    },
  });
};

export const useGetAvailableRewards = () => {
  return useQuery({
    queryKey: ['rewards', 'available'],
    queryFn: RewardsApi.availableRewards,
  });
};

/**
 * Hook to handle the purchase of a reward.
 * It automatically refreshes the rewards list and student data.
 */
export const usePurchaseReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId) => RewardsApi.purchase(rewardId),
    onSuccess: () => {
      // 1. Refresh available rewards list
      queryClient.invalidateQueries(['rewards']);
      
      // 2. Portfolio Tip: Also refresh the user's profile/points 
      // so their "Current Points" update immediately on the screen.
      queryClient.invalidateQueries(['user', 'profile']); 
      
      console.log("Purchase successful and cache invalidated");
    },
    onError: (error) => {
      console.error("Purchase failed:", error.response?.data?.message || error.message);
    }
  });
};

export const useGetPupilPurchaseHistory = (classroomId, pupilId) => {
  return useQuery({
    // Unique key for caching: includes IDs to ensure data doesn't mix between students
    queryKey: ['pupil-history', classroomId, pupilId],
    
    // The API call we just defined
    queryFn: () => RewardsApi.pupilHistory(classroomId, pupilId),
    
    // Safety check: Don't run the query if IDs aren't provided yet
    enabled: !!classroomId && !!pupilId,
    
    // Senior Tip: Stale time keeps the data fresh but prevents 
    // unnecessary re-fetches when switching tabs quickly.
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};