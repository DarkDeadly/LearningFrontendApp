import { create } from "zustand"

export const useCourseStore = create(set => ({
    selectedCourse : null , 
    setSelectedCourse : (course) => set({selectedCourse : course}),
    clearSelectedCourse : () => set({selectedCourse : null})
}))