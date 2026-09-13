import { create } from 'zustand';

import { demoProfile, type PathwayId, type Profile } from './guidanceData';

interface GuidanceState {
  profile: Profile;
  selectedSchoolId?: string;
  selectedPathwayId?: PathwayId;
  completedTaskIds: string[];
  setProfileField: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
  setStudentField: <K extends keyof Profile['student']>(
    key: K,
    value: Profile['student'][K],
  ) => void;
  setParentField: <K extends keyof Profile['parent']>(key: K, value: Profile['parent'][K]) => void;
  selectSchool: (schoolId: string, pathwayId?: PathwayId) => void;
  toggleTask: (taskId: string) => void;
  resetDemo: () => void;
}

export const useGuidanceStore = create<GuidanceState>((set) => ({
  profile: demoProfile,
  completedTaskIds: [],
  setProfileField: (key, value) =>
    set((state) => ({ profile: { ...state.profile, [key]: value } })),
  setStudentField: (key, value) =>
    set((state) => ({
      profile: { ...state.profile, student: { ...state.profile.student, [key]: value } },
    })),
  setParentField: (key, value) =>
    set((state) => ({
      profile: { ...state.profile, parent: { ...state.profile.parent, [key]: value } },
    })),
  selectSchool: (selectedSchoolId, selectedPathwayId) =>
    set({ selectedSchoolId, selectedPathwayId }),
  toggleTask: (taskId) =>
    set((state) => ({
      completedTaskIds: state.completedTaskIds.includes(taskId)
        ? state.completedTaskIds.filter((id) => id !== taskId)
        : [...state.completedTaskIds, taskId],
    })),
  resetDemo: () =>
    set({
      profile: demoProfile,
      selectedSchoolId: undefined,
      selectedPathwayId: undefined,
      completedTaskIds: [],
    }),
}));
