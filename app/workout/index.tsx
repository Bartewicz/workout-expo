import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/view/ParallaxScrollView';
import { useWorkoutContext } from '@/store/workout/context';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Miliseconds, TimeRange } from '@/utils/types/time';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Timer } from '@/components/Timer';
import { CountdownTimer } from '@/components/CountdownTimer';
import { formatTime } from '@/utils/time/formatTime';
import { composeScheduleFromPlan } from '@/utils/workout/composeScheduleFromPlan';

type GlobalTimerState = 'uninitialised' | 'running' | 'paused' | 'completed';

export default function WorkoutScreen() {
  const { plan } = useWorkoutContext();
  const schedule = composeScheduleFromPlan(plan);

  const [startTime, setStartTime] = useState<Miliseconds>();
  const [endTime, setEndTime] = useState<Miliseconds>();
  const [timestamps, setTimestamps] = useState<TimeRange[]>([]);
  const [globalTimerState, setGlobalTimerState] = useState<GlobalTimerState>('uninitialised');

  const [schedulePhaseIdx, setNextSchedulePhaseIdx] = useState(0);

  const onTogglePaused = () => {
    switch (globalTimerState) {
      case 'paused': {
        setGlobalTimerState('running');
        return;
      }
      case 'running':
      default: {
        setGlobalTimerState('paused');
        return;
      }
    }
  };

  const onClickReset = () => {
    setGlobalTimerState('uninitialised');
    setNextSchedulePhaseIdx(0);
  };

  const onPressWorkoutToggle = () => {
    if (schedulePhaseIdx === schedule.length - 1) return;
    if (schedulePhaseIdx === 0) setGlobalTimerState('running');
    setNextSchedulePhaseIdx((prev) => prev + 1);
    // Todo add proceed to workout summary
  };
  const currentPhase = schedule[schedulePhaseIdx];

  const isGloballyUninitialised = globalTimerState === 'uninitialised';
  const isGloballyPaused = globalTimerState === 'paused';
  const isExercisePhaseNow = currentPhase.phase === 'exercise';
  const isCompleted = currentPhase.phase === 'completed';
  const showCountdown = ['break', 'setBreak'].includes(currentPhase.phase);

  console.log('isGloballyUninitialised', isGloballyUninitialised);
  console.log('isGloballyPaused', isGloballyPaused);
  console.log('isCompleted', isCompleted);

  return (
    <ParallaxScrollView
      height={100}
      headerBackgroundColor={Colors.background.primary}
      header={
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            {globalTimerState === 'uninitialised'
              ? 'Rozpocznij trening! 🚀'
              : globalTimerState === 'completed'
              ? 'Udało się! 🔥'
              : 'Budowanie mięśni w trakcie... 💪'}
          </ThemedText>
        </View>
      }
    >
      <View style={styles.contentContainer}>
        <View id="globalTimerContainer" style={styles.globalTimerContainer}>
          <Timer state={globalTimerState} textStyle={styles.globalTimerText} fontSize={24} />
        </View>
        <View style={styles.mainContentContainer}>
          <Pressable
            disabled={isGloballyUninitialised}
            onPress={onClickReset}
            style={getActionBtnResetStyles({
              isGloballyUninitialised,
            })}
          >
            <Ionicons name="refresh" color={Colors.common.primary} size={50} />
          </Pressable>
          <View id="workoutTimerContainer" style={styles.workoutTimerContainer}>
            {showCountdown ? (
              <CountdownTimer
                from={
                  currentPhase.phase === 'break'
                    ? plan.exercisesBreakDuration
                    : plan.setsBreakDuration
                }
                state={globalTimerState}
                textStyle={styles.workoutTimer}
              />
            ) : (
              <Timer state={globalTimerState} textStyle={styles.workoutTimer} fontSize={30} />
            )}
          </View>
          <Pressable
            disabled={isGloballyUninitialised || isCompleted}
            onPress={onTogglePaused}
            style={getActionBtnTogglePauseStyles({
              isCompleted,
              isGloballyUninitialised,
              isGloballyPaused,
            })}
          >
            <Ionicons
              name={isGloballyUninitialised || isGloballyPaused || isCompleted ? 'play' : 'pause'}
              color={Colors.common.primary}
              size={50}
            />
          </Pressable>
        </View>
        {/* TODO: Add bounce animation on click: https://reactnative.dev/docs/animations */}
        {/* <Animated.View > */}
        <Pressable
          onPress={onPressWorkoutToggle}
          disabled={isGloballyPaused}
          style={getMainActionBtnStyles({
            isCompleted,
            isExercisePhaseNow,
            isGloballyPaused,
          })}
        >
          <Ionicons
            name={getMainActionBtnIconName({
              isCompleted,
              isExercisePhaseNow,
              isGloballyUninitialised,
            })}
            color={isCompleted ? Colors.common.gold : Colors.common.primary}
            size={50}
          />
        </Pressable>
        {/* </Animated.View> */}
      </View>
      <View style={{ alignItems: 'center' }}>
        <ThemedText>Faza: {currentPhase.phase}</ThemedText>
        <ThemedText>Nr ćwiczenia: {isExercisePhaseNow && currentPhase.exerciseIdx + 1}</ThemedText>
        <ThemedText>Typ: {'type' in currentPhase && currentPhase.type}</ThemedText>
        <ThemedText>Set: {isExercisePhaseNow && currentPhase.setIdx + 1}</ThemedText>
        {isExercisePhaseNow && currentPhase.type === 'reps' ? (
          <ThemedText>Ilość powtórzeń: {currentPhase.repetitions}</ThemedText>
        ) : isExercisePhaseNow && currentPhase.type === 'timed' ? (
          <ThemedText>Czas trwania: {formatTime(currentPhase.duration)} s</ThemedText>
        ) : null}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    lineHeight: 38,
  },
  contentContainer: { alignItems: 'center' },
  mainContentContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  globalTimerContainer: {
    marginBottom: 30,
    height: 20,
  },
  globalTimerText: {
    color: Colors.common.blue,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 600,
  },
  workoutTimerContainer: {
    justifyContent: 'center',
    borderWidth: 8,
    borderRadius: 90,
    borderLeftColor: Colors.common.primary,
    borderRightColor: Colors.common.primary,
    flexWrap: 'nowrap',
    width: 180,
    height: 180,
  },
  workoutTimer: {
    color: Colors.common.primary,
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  actionBtn: {
    borderColor: Colors.common.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnReset: {
    borderWidth: 4,
    borderRadius: 40,
    width: 80,
    height: 80,
    transform: [{ rotate: '-45deg' }, { scaleX: -1 }],
    paddingBottom: 5,
  },
  actionBtnTogglePause: {
    borderWidth: 4,
    borderRadius: 40,
    alignSelf: 'flex-end',
    width: 80,
    height: 80,
  },
  actionBtnWorkoutMain: {
    borderWidth: 5,
    borderRadius: 50,
    width: 100,
    height: 100,
  },
});

function getMainActionBtnIconName({
  isCompleted,
  isExercisePhaseNow,
  isGloballyUninitialised,
}: {
  isCompleted: boolean;
  isExercisePhaseNow: boolean;
  isGloballyUninitialised: boolean;
}) {
  switch (true) {
    case isGloballyUninitialised:
      return 'rocket';
    case isExercisePhaseNow:
      return 'barbell-outline';
    case isCompleted:
      return 'trophy';
    default:
      return 'timer-outline';
  }
}

function getActionBtnResetStyles({
  isGloballyUninitialised,
}: {
  isGloballyUninitialised: boolean;
}) {
  return [
    styles.actionBtn,
    styles.actionBtnReset,
    isGloballyUninitialised && {
      opacity: 0.5,
    },
  ];
}

function getActionBtnTogglePauseStyles({
  isCompleted,
  isGloballyUninitialised,
  isGloballyPaused,
}: {
  isCompleted: boolean;
  isGloballyUninitialised: boolean;
  isGloballyPaused: boolean;
}) {
  const isNotRunning = isGloballyUninitialised || isGloballyPaused;
  return [
    styles.actionBtn,
    styles.actionBtnTogglePause,
    isNotRunning && {
      paddingLeft: 5,
    },
    (isCompleted || isGloballyUninitialised) && {
      opacity: 0.5,
    },
  ];
}

function getMainActionBtnStyles({
  isCompleted,
  isExercisePhaseNow,
  isGloballyPaused,
}: {
  isCompleted: boolean;
  isExercisePhaseNow: boolean;
  isGloballyPaused: boolean;
}) {
  return [
    styles.actionBtn,
    styles.actionBtnWorkoutMain,
    isExercisePhaseNow && {
      transform: [{ rotate: '-45deg' }],
    },
    isGloballyPaused &&
      !isCompleted && {
        opacity: 0.5,
      },
  ];
}
