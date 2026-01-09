import { create } from "zustand"

export const usePupilStore = create(set => ({
    selectedStudent : null , 
    setSelectedStudent : (student) => set({selectedStudent : student}),
    clearSelectedStudent : () => set({selectedStudent : null})
}))