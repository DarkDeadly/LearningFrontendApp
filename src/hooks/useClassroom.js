import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import classroomApi from "../api/classApi"

export const useGetMyClassroom = () => {
    return useQuery({
       queryKey : ['classrooms' , 'my'] ,
       queryFn : classroomApi.getMyClassrooms,
       staleTime : 7 * 60 * 1000,
       select: (data) => data.classrooms || []

    })
}

export const useGetAllClassrooms = () => {
  return useQuery({
    queryKey : ['classroom'] , 
    queryFn: classroomApi.getAllClasses,
    staleTime : 7 * 60 * 1000 ,
    select : (data) => data.classrooms || []
  })
}

export const useCreateClassroom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (data) => classroomApi.createClassroom(data),
        onSuccess : (response) => {
              console.log('✅ Classroom created:', response);
      
      // Invalidate and refetch classrooms list
      queryClient.invalidateQueries({ queryKey: ['classrooms', 'my'] });
    },
    onError: (error) => {
      console.error('❌ Create classroom error:', error);
    },
        })
    }

export const useJoinClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, pin }) => 
      classroomApi.joinClassroom(classroomId, pin),
    onSuccess: (response) => {
      console.log('✅ Joined classroom:', response);
      
      // Invalidate user profile (classroomId changed)
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Invalidate classroom details
      queryClient.invalidateQueries({ queryKey: ['classroom'] });
    },
    onError: (error) => {
      console.error('❌ Join classroom error:', error);
    },
  });
};