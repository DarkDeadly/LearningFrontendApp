// src/api/pointApi.js
import apiClient from "./client";

const pointApi = {
  addPoints: async (data, classroomId) => {
    const response = await apiClient.post(`/classrooms/${classroomId}/points/give`, data);
    return response.data;
  },

  reducePoints: async (data, classroomId) => {
    const response = await apiClient.post(`/classrooms/${classroomId}/points/remove`, data);
    return response.data;
  },

  getHistory: async (classroomId, pupilId) => {
    const response = await apiClient.get(`/classrooms/${classroomId}/points/${pupilId}`);
    return response.data;
  },
};

export default pointApi;