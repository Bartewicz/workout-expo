type ExerciseType = 'reps' | 'time';

type BaseExercise = {
  type: ExerciseType;
};

export type RepsExercise = BaseExercise & {
  type: 'reps';
  sets: { reps: number }[];
};

export type TimedExercise = BaseExercise & {
  type: 'time';
  sets: { time: number }[];
};

export type Exercise = (RepsExercise & {}) | (TimedExercise & {});
