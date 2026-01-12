import { create } from "zustand"

export const useClassStore = create(set => ({
    selectClass : null , 
    setSelectedClass : (Class) => set({selectClass : Class}),
    clearSelectedClass : () => set({selectClass : null})
}))