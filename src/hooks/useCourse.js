import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import courseApi from "../api/courseApi";


export const useCreateCourse = () => {
      const queryClient = useQueryClient();
      return useMutation({
      mutationFn: ({ title, classroomId, description  }) =>
      courseApi.addCourse({ description, title }, classroomId),

    onSuccess: async(responseData, variables) => {
      queryClient.invalidateQueries(['classroom', variables.classroomId , 'courses']);
    },
    onError: (error) => console.error("Error adding points", error),
  });

}

export const useGetCourses = (classroomId) => {
    return useQuery({
        queryKey : ['classroom' , classroomId , "courses" ],
        queryFn : () => courseApi.getCourses(classroomId),
        staleTime: 7 * 60 * 1000,
        enabled: !!classroomId
    })
}