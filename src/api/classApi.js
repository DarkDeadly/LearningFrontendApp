import apiClient from "./client"


const classroomApi = {
    createClassroom : async(data) => {
        const response = await apiClient.post(`/classrooms`,data)
        return response.data
    },
    getMyClassrooms : async() => {
        const response = await apiClient.get("/classrooms/my")
        return response.data
    },
    joinClassroom : async( classroomId, pin ) => {
        const response = await apiClient.post(`/classrooms/${classroomId}/join` , {pin})
        return response.data
    },
    getClassroomDetails : async(classroomId) => {
        const response = await apiClient.get(`/classrooms/${classroomId}`)
        return response.data
    },
    getClassroomPupils : async (classroomId) => {
        const response = await apiClient.get(`/classrooms/${classroomId}/pupils`)
        return response.data
    },
    getAllClasses : async () => {
        const response = await apiClient.get("/classrooms")
        return response.data
    }
  
}

export default classroomApi