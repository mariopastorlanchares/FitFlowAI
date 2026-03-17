export type ExerciseSet = {
  id: string;
  targetReps: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  imageUrl?: string;
  sets: ExerciseSet[];
  restSeconds: number;
};

export type ActiveWorkoutSession = {
  id: string;
  workoutName: string;
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  currentExerciseIndex: number;
};
