import type { WorkoutPlan } from '@/store/workout/reducer';
import {
  getHasPlanAllBreakDurations,
  getHasPlanAllRepsExerciseInput,
  getHasPlanAllTimedExerciseInput,
} from './plan';

type BaseExercisePhase = {
  phase: 'exercise';
  exerciseIdx: number;
  setIdx: number;
};
type RepsExercisePhase = BaseExercisePhase & {
  type: 'reps';
  repetitions: number;
};
type TimedExercisePhase = BaseExercisePhase & {
  type: 'timed';
  duration: number;
};
type ExercisePhase = RepsExercisePhase | TimedExercisePhase;
type BreakPhase = {
  phase: 'break' | 'setBreak';
  duration: number;
};
export type Phase =
  | { phase: 'initial' }
  | { phase: 'final' }
  | { phase: 'completed' }
  | ExercisePhase
  | BreakPhase;

export const composeScheduleFromPlan = (plan: WorkoutPlan): Phase[] => {
  if (!getHasPlanAllBreakDurations(plan)) {
    throw Error('Missing breakes durations!');
  }

  const schedule: Phase[] = [
    {
      phase: 'initial',
    },
  ];

  const hasPlanAllRepsExerciseInput = getHasPlanAllRepsExerciseInput(plan);
  const hasPlanAllTimedExerciseInput = getHasPlanAllTimedExerciseInput(plan);

  const {
    repetitionExercisesSetsCount,
    repetitionExercisesCount,
    repetitionExercisesRepetitionsCount,
    timedExercisesSetsCount,
    timedExercisesCount,
    timedExercisesDuration,
    setsBreakDuration,
    exercisesBreakDuration,
  } = plan;

  const repsExercisesAllSets = hasPlanAllRepsExerciseInput
    ? repetitionExercisesCount * repetitionExercisesSetsCount
    : 0;
  const timedExercicesAllSets = hasPlanAllTimedExerciseInput
    ? timedExercisesSetsCount * timedExercisesCount
    : 0;

  // There's a break after every exercise, so taking that into account
  // later: even item is exercise, odd is some kind of break
  let repsExercisesScheduleItemsCount = 0;
  if (hasPlanAllRepsExerciseInput && hasPlanAllTimedExerciseInput) {
    // Need to include the break between different exercises types
    repsExercisesScheduleItemsCount = repsExercisesAllSets * 2;
  } else if (hasPlanAllRepsExerciseInput) {
    // No timed exercises ? No need for a last break
    repsExercisesScheduleItemsCount = repsExercisesAllSets * 2 - 1;
  }
  const timedExercisesScheduleItemsCount =
    timedExercicesAllSets > 0 ? timedExercicesAllSets * 2 - 1 : 0;

  let repsExercises = new Array(repsExercisesScheduleItemsCount).fill(undefined) as (
    | RepsExercisePhase
    | BreakPhase
  )[];
  let timedExercises = new Array(timedExercisesScheduleItemsCount).fill(undefined) as (
    | TimedExercisePhase
    | BreakPhase
  )[];

  repsExercises = repsExercises.map((_, idx) => {
    if (idx % 2 === 0) {
      // (0) break (2) break (4) break (6) break (8) break ...
      return {
        phase: 'exercise',
        type: 'reps',
        exerciseIdx: Math.floor(idx / repetitionExercisesSetsCount),
        setIdx: (idx / 2) % repetitionExercisesSetsCount,
        repetitions: repetitionExercisesRepetitionsCount,
      };
    } else {
      if (((idx + 1) / (2 * repetitionExercisesSetsCount)) % 1 === 0) {
        // ex 1 ex 3 ex 5 ex (7) ex 9 ex 11 ex 13 ex (15) ex ...
        return {
          phase: 'break',
          duration: exercisesBreakDuration,
        };
      } else {
        // ex (1) ex (3) ex (5) ex 7 ex (9) ex (11) ex (13) ex 15 ex ...
        return {
          phase: 'setBreak',
          duration: setsBreakDuration,
        };
      }
    }
  });

  timedExercises = timedExercises.map((_, idx) => {
    if (idx % 2 === 0) {
      // (0) break (2) break (4) break (6) break (8) break ...
      return {
        phase: 'exercise',
        type: 'timed',
        exerciseIdx: Math.floor(idx / timedExercisesSetsCount),
        setIdx: (idx / 2) % timedExercisesSetsCount,
        duration: timedExercisesDuration,
      };
    } else {
      if (((idx + 1) / (2 * timedExercisesSetsCount)) % 1 === 0) {
        // ex 1 ex 3 ex 5 ex (7) ex 9 ex 11 ex 13 ex (15) ex ...
        return {
          phase: 'break',
          duration: exercisesBreakDuration,
        };
      } else {
        // ex (1) ex (3) ex (5) ex 7 ex (9) ex (11) ex (13) ex 15 ex ...
        return {
          phase: 'setBreak',
          duration: setsBreakDuration,
        };
      }
    }
  });

  schedule.push(
    ...repsExercises,
    ...timedExercises,
    {
      phase: 'final',
    },
    {
      phase: 'completed',
    }
  );

  return schedule;
};
