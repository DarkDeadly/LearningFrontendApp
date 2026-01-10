import apiClient from "./client"



const courseApi = {
    addCourse : async (data , classroomId) => {
        const response = await apiClient.post(`/classrooms/${classroomId}/courses` , data)
        return response.data
    },
    deleteCourse : async (classroomId , courseId) => {
        const response = await apiClient.delete(`/classrooms/${classroomId}/courses/${courseId}`)
        return response.data
    },
    getCourses : async (classroomId) => {
        const response = await apiClient.get(`/classrooms/${classroomId}/courses`)
        return response.data
    }
}


export default courseApi