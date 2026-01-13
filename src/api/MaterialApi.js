

import client from "./client";

const MaterialApi = {
   createMaterial: async (courseId, title, file, classroomId) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file); // Passing the {uri, name, type} object

    return client.post(
        `/classrooms/${classroomId}/courses/${courseId}/materials`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                // This is crucial for Render if the file is large
                'Accept': 'application/json',
            },
            // Audio files take time to upload to Render + Cloudinary
            timeout: 120000, 
        }
    );
},

    deleteMaterial: async (materialId, classroomId, courseId) => {
        return client.delete(
            `/classrooms/${classroomId}/courses/${courseId}/materials/${materialId}`
        );
    },
};

export default MaterialApi;