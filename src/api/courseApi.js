import { validateParams, validateResponse } from "./apiHelpers";
import apiClient from "./client";

const courseApi = {
    addCourse: async (data, classroomId) => {
        validateParams({ data, classroomId });
        const response = await apiClient.post(`/classrooms/${classroomId}/courses`, data);
        return validateResponse(response, `/classrooms/${classroomId}/courses`);
    },

    deleteCourse: async (classroomId, courseId) => {
        validateParams({ classroomId, courseId });
        const response = await apiClient.delete(`/classrooms/${classroomId}/courses/${courseId}`);
        return validateResponse(response, `/classrooms/${classroomId}/courses/${courseId}`);
    },

    getCourses: async (classroomId) => {
        validateParams({ classroomId });
        const response = await apiClient.get(`/classrooms/${classroomId}/courses`);
        return validateResponse(response, `/classrooms/${classroomId}/courses`);
    },

    getCourseDetail: async (classroomId, courseId) => {
        validateParams({ classroomId, courseId });
        const response = await apiClient.get(`/classrooms/${classroomId}/courses/${courseId}`);
        return validateResponse(response, `/classrooms/${classroomId}/courses/${courseId}`);
    }
}

export default courseApi