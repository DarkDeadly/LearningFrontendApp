
import { validateParams, validateResponse } from "./apiHelpers";
import client from "./client";

const MaterialApi = {
    createMaterial: async (courseId, title, file, classroomId, onProgress) => {
        // Validate required parameters
        validateParams({ courseId, title, file, classroomId });

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        const response = await client.post(
            `/classrooms/${classroomId}/courses/${courseId}/materials`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                timeout: 120000,

                // FIX: Added upload progress tracking for better UX
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                }
            }
        );

        return validateResponse(response, `/classrooms/${classroomId}/courses/${courseId}/materials`);
    },

    deleteMaterial: async (materialId, classroomId, courseId) => {
        validateParams({ materialId, classroomId, courseId });
        const response = await client.delete(
            `/classrooms/${classroomId}/courses/${courseId}/materials/${materialId}`
        );
        return validateResponse(response, `/classrooms/${classroomId}/courses/${courseId}/materials/${materialId}`);
    },
};

export default MaterialApi;