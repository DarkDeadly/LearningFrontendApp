import { validateParams, validateResponse } from "./apiHelpers";
import apiClient from "./client";

export const RewardsApi = {
    create: async (classroomId, data) => {
        validateParams({ classroomId, data });
        const response = await apiClient.post(`/rewards/class/${classroomId}`, data);
        return validateResponse(response, `/rewards/class/${classroomId}`);
    },

    purchase: async (rewardId) => {
        validateParams({ rewardId });
        const response = await apiClient.post(`/rewards/${rewardId}/purchase`);
        return validateResponse(response, `/rewards/${rewardId}/purchase`);
    },

    availableRewards: async () => {
        const response = await apiClient.get(`/rewards/available`);
        return validateResponse(response, '/rewards/available');
    },

    classRewards: async (classroomId) => {
        validateParams({ classroomId });
        const response = await apiClient.get(`/rewards/class/${classroomId}`);
        return validateResponse(response, `/rewards/class/${classroomId}`);
    },

    pupilHistory: async (classroomId, pupilId) => {
        validateParams({ classroomId, pupilId });
        const response = await apiClient.get(`/rewards/class/${classroomId}/${pupilId}`);
        return validateResponse(response, `/rewards/class/${classroomId}/${pupilId}`);
    }
}