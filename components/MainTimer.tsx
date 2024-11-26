import { Colors } from '@/constants/Colors';
import type { ExercisePhase, Phase } from '@/utils/workout/composeScheduleFromPlan';
import { StyleSheet, View } from 'react-native';
import { CountdownTimer } from './CountdownTimer';
import { ThemedText } from './ThemedText';
import { ExerciseTimer } from './ExerciseTimer';

type MainTimerProps = {
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
  currentPhase: Phase;
  nextPhase?: Phase;
};

export const MainTimer = ({ currentPhase, nextPhase, state }: MainTimerProps) => {
  switch (currentPhase.phase) {
    case 'break':
    case 'setBreak': {
      return <CountdownTimer from={currentPhase.duration} state={state} />;
    }
    case 'initial':
    case 'exercise': {
      const phase = currentPhase.phase === 'exercise' ? currentPhase : (nextPhase as ExercisePhase);
      return phase.type === 'reps' ? (
        <View style={{ gap: 10 }}>
          <ThemedText style={styles.repsLabel}>{phase.repetitions}</ThemedText>
          <ExerciseTimer state={state} />
        </View>
      ) : (
        <ExerciseTimer state={state} />
      );
    }
  }
};

const styles = StyleSheet.create({
  repsLabel: {
    fontSize: 64,
    lineHeight: 64,
    fontWeight: 600,
    color: Colors.text.ultraLight,
    alignSelf: 'center',
  },
});
