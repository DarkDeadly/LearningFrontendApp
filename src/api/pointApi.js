// src/api/pointApi.js
import { validateParams, validateResponse } from "./apiHelpers";
import apiClient from "./client";

const pointApi = {
  addPoints: async (data, classroomId) => {
    validateParams({ data, classroomId });
    const response = await apiClient.post(`/classrooms/${classroomId}/points/give`, data);
    return validateResponse(response, `/classrooms/${classroomId}/points/give`);
  },

  reducePoints: async (data, classroomId) => {
    validateParams({ data, classroomId });
    const response = await apiClient.post(`/classrooms/${classroomId}/points/remove`, data);
    return validateResponse(response, `/classrooms/${classroomId}/points/remove`);
  },

  getHistory: async (classroomId, pupilId) => {
    validateParams({ classroomId, pupilId });
    const response = await apiClient.get(`/classrooms/${classroomId}/points/${pupilId}`);
    return validateResponse(response, `/classrooms/${classroomId}/points/${pupilId}`);
  },
};

export default pointApi;