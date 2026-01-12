

import apiClient from "./client";

const MaterialApi = {
    createMaterial: async (courseId, title, file, classroomId) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        return apiClient.post(
            `/classrooms/${classroomId}/courses/${courseId}/materials`,
            formData
        );
    },
    deleteMaterial: async (materialId, classroomId , courseId)  => {
        return apiClient.delete(`/classrooms/${classroomId}/courses/${courseId}/materials/${materialId}`);
    },
};

export default MaterialApi;