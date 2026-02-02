import { useMutation, useQueryClient } from '@tanstack/react-query';
import MaterialApi from '../api/MaterialApi';

export const useMaterial = (courseId, classroomId) => {
    const queryClient = useQueryClient();

    const { mutate: createMaterial, isPending: isCreating } = useMutation({
        mutationFn: ({ title, file }) =>
            MaterialApi.createMaterial(courseId, title, file, classroomId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classroom', classroomId, "courses", courseId] });
        },
        onError: (err) => {
            // Log the actual server response to find out WHY it's a 400
            console.error("Upload Error:", err.response?.data || err.message);
        }
    });

    const { mutate: deleteMaterial, isPending: isDeleting } = useMutation({
        mutationFn: ({ materialId }) =>
            MaterialApi.deleteMaterial(materialId, classroomId, courseId),
        onSuccess: () => {
            // FIX: Use correct query key structure to match useGetCourse
            // This ensures the course details page updates after material deletion
            queryClient.invalidateQueries({
                queryKey: ['classroom', classroomId, 'courses', courseId]
            });
        }
    });

    return { createMaterial, isCreating, deleteMaterial, isDeleting };
};