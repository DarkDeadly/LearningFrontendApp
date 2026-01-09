import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pointApi from "../api/pointApi";
import { storage } from "../util/storage";


export const useGivePoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, classroomId, reason, pupilId }) =>
      pointApi.addPoints({ amount, reason, pupilId }, classroomId),

    onSuccess: async(responseData, variables) => {
      const { classroomId, pupilId } = variables;
      const updatedUser = responseData.user;

      if (updatedUser) {
        // 1. Update AsyncStorage (Persists the points)
        await storage.saveUserData(updatedUser);

        // 2. Update React Query Profile Cache (Instant UI update)
        queryClient.setQueryData(['profile'], updatedUser);
      }

      queryClient.invalidateQueries(['classroom', classroomId, 'pupils']);
      queryClient.invalidateQueries(['history', classroomId, pupilId]);
    },
    onError: (error) => console.error("Error adding points", error),
  });
};

export const useReducePoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, classroomId, reason, pupilId }) =>
      pointApi.reducePoints({ amount, reason, pupilId }, classroomId),

    onSuccess: async (responseData, variables) => {
      const { classroomId, pupilId } = variables;
      const updatedUser = responseData.user;

      if (updatedUser) {
        // 1. Update AsyncStorage (Persists the points)
        await storage.saveUserData(updatedUser);

        // 2. Update React Query Profile Cache (Instant UI update)
        queryClient.setQueryData(['profile'], updatedUser);
      }

      queryClient.invalidateQueries(['classroom', classroomId, 'pupils']);
      queryClient.invalidateQueries(['history', classroomId, pupilId]);
    },
    onError: (error) => console.error("Error reducing points", error),
  });
};
export const useGetHistory =  (classroomId , pupilId) => {
    return useQuery({
        queryKey : ['history' , classroomId , pupilId],
        queryFn : () => pointApi.getHistory(classroomId , pupilId),
        staleTime: 7 * 60 * 1000,
        enabled: !!classroomId && !!pupilId

    })
}