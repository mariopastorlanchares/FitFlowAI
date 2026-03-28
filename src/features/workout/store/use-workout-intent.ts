import { create } from 'zustand';

import type { TrainingLocation } from '@shared/types/workout-context';

export type WorkoutDurationKey = 'short' | 'medium' | 'long' | 'extended';
export type WorkoutEnergyKey = 'low' | 'medium' | 'high';

interface WorkoutIntentState {
  location: TrainingLocation;
  duration: WorkoutDurationKey;
  energy: WorkoutEnergyKey;
  setLocation: (location: TrainingLocation) => void;
  setDuration: (duration: WorkoutDurationKey) => void;
  setEnergy: (energy: WorkoutEnergyKey) => void;
}

export const useWorkoutIntent = create<WorkoutIntentState>((set) => ({
  location: 'gym',
  duration: 'medium',
  energy: 'medium',
  setLocation: (location) => set({ location }),
  setDuration: (duration) => set({ duration }),
  setEnergy: (energy) => set({ energy }),
}));
