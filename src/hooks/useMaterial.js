import { useMutation, useQueryClient } from '@tanstack/react-query';
import MaterialApi from '../api/MaterialApi';

export const useMaterial = (courseId , classroomId) => {
    const queryClient = useQueryClient();

    const { mutate: createMaterial, isPending: isCreating } = useMutation({
        mutationFn: ({ title, file }) => MaterialApi.createMaterial(courseId, title, file , classroomId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });

   const { mutate: deleteMaterial, isPending: isDeleting } = useMutation({
    mutationFn: ({ materialId }) =>
        MaterialApi.deleteMaterial(materialId, classroomId, courseId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['course', courseId] });
        queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
});

    return {
        createMaterial,
        isCreating,
        deleteMaterial,
        isDeleting,
    };
};
