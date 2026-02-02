import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pointApi from "../api/pointApi";
import { storage } from "../util/storage";


export const useGivePoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, classroomId, reason, pupilId }) =>
      pointApi.addPoints({ amount, reason, pupilId }, classroomId),

    onSuccess: async (responseData, variables) => {
      const { classroomId, pupilId } = variables;
      const updatedUser = responseData.user;

      if (updatedUser) {
        // FIX: Update cache FIRST for instant UI update (no await)
        // This prevents race condition where UI waits for storage to complete
        queryClient.setQueryData(['profile'], updatedUser);

        // Then save to storage in background (don't await to avoid blocking UI)
        storage.saveUserData(updatedUser).catch(err =>
          console.error('Failed to save user data to storage:', err)
        );
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
        // FIX: Update cache FIRST for instant UI update (no await)
        // This prevents race condition where UI waits for storage to complete
        queryClient.setQueryData(['profile'], updatedUser);

        // Then save to storage in background (don't await to avoid blocking UI)
        storage.saveUserData(updatedUser).catch(err =>
          console.error('Failed to save user data to storage:', err)
        );
      }

      queryClient.invalidateQueries(['classroom', classroomId, 'pupils']);
      queryClient.invalidateQueries(['history', classroomId, pupilId]);
    },
    onError: (error) => console.error("Error reducing points", error),
  });
};
export const useGetHistory = (classroomId, pupilId) => {
  return useQuery({
    queryKey: ['history', classroomId, pupilId],
    queryFn: () => pointApi.getHistory(classroomId, pupilId),
    staleTime: 7 * 60 * 1000,
    enabled: !!classroomId && !!pupilId

  })
}