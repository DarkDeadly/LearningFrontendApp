import apiClient from "./client"


export const RewardsApi = {
    create : async (classroomId , data) => {
        const response = await apiClient.post(`/rewards/class/${classroomId}` , data)
        return response.data
    },
    purchase : async (rewardId) => {
        const response = await apiClient.post(`/rewards/${rewardId}/purchase`)
        return response.data
    },
    availableRewards : async() => {
        const response = await apiClient.get(`/rewards/available`)
        return response.data
    },
    classRewards : async (classroomId) => {
        const response = await apiClient.get(`/rewards/class/${classroomId}`)
        return response.data
    },
    pupilHistory : async (classroomId , pupilId) => {
        const response = await apiClient.get(`/rewards/class/${classroomId}/${pupilId}`)
        return response.data
    }
}