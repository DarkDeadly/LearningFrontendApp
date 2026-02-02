import { validateParams, validateResponse } from "./apiHelpers";
import apiClient from "./client";

const classroomApi = {
    createClassroom: async (data) => {
        validateParams({ data });
        const response = await apiClient.post(`/classrooms`, data);
        return validateResponse(response, '/classrooms');
    },

    getMyClassrooms: async () => {
        const response = await apiClient.get("/classrooms/my");
        return validateResponse(response, '/classrooms/my');
    },

    joinClassroom: async (classroomId, pin) => {
        validateParams({ classroomId, pin });
        const response = await apiClient.post(`/classrooms/${classroomId}/join`, { pin });
        return validateResponse(response, `/classrooms/${classroomId}/join`);
    },

    getClassroomDetails: async (classroomId) => {
        validateParams({ classroomId });
        const response = await apiClient.get(`/classrooms/${classroomId}`);
        return validateResponse(response, `/classrooms/${classroomId}`);
    },

    getClassroomPupils: async (classroomId) => {
        validateParams({ classroomId });
        const response = await apiClient.get(`/classrooms/${classroomId}/pupils`);
        return validateResponse(response, `/classrooms/${classroomId}/pupils`);
    },

    getAllClasses: async () => {
        const response = await apiClient.get("/classrooms");
        return validateResponse(response, '/classrooms');
    }
}

export default classroomApi