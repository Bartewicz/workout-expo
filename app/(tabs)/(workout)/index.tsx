import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/view/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useWorkoutContext } from '@/store/workout/context';
import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';

export default function PlannerScreen() {
  const repExercisesInputRef = useRef<TextInput>(null);
  const repSetsInputRef = useRef<TextInput>(null);
  const repRepsInputRef = useRef<TextInput>(null);
  const timedExercisesInputRef = useRef<TextInput>(null);
  const timedSetsInputRef = useRef<TextInput>(null);
  const timedDurationInputRef = useRef<TextInput>(null);
  const exercisesBreakInputRef = useRef<TextInput>(null);
  const setBreakInputRef = useRef<TextInput>(null);

  const { actions, plan } = useWorkoutContext();
  const router = useRouter();

  const disabled = Object.values(plan).some((value) => !value);

  const onPressProceed = useCallback(() => {
    if (!disabled) {
      router.push('/workout');
    }
  }, [disabled]);

  return (
    <ParallaxScrollView
      header={
        <View style={styles.titleContainer}>
          <HelloWave />
          <ThemedText type="title">Zaplanuj swój trening 📝</ThemedText>
        </View>
      }
    >
      <View style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          1. Ćwiczenia na ilość powtórzeń:
        </ThemedText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              width: '30%',
            }}
          >
            <ThemedText type="defaultSemiBold">Ile ćwiczeń</ThemedText>
            <TextInput
              ref={repExercisesInputRef}
              onSubmitEditing={() => repSetsInputRef.current?.focus()}
              keyboardType="numeric"
              enterKeyHint="next"
              // Todo: eventually remove default value
              defaultValue="8"
              maxLength={2}
              onChangeText={actions.setRepetitionExercisesCount}
              placeholder="1"
              placeholderTextColor={Colors.text.primaryDark}
              selectionColor={Colors.common.tint}
              style={styles.numericInput}
            />
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '30%',
            }}
          >
            <ThemedText type="defaultSemiBold">Ile serii</ThemedText>
            <TextInput
              ref={repSetsInputRef}
              onSubmitEditing={() => repRepsInputRef.current?.focus()}
              keyboardType="numeric"
              enterKeyHint="next"
              // Todo: eventually remove default value
              defaultValue="4"
              maxLength={2}
              onChangeText={actions.setRepetitionExerciseSetsCount}
              placeholder="1"
              placeholderTextColor={Colors.text.primaryDark}
              selectionColor={Colors.common.tint}
              style={styles.numericInput}
            />
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '30%',
            }}
          >
            <ThemedText type="defaultSemiBold">Ile powtórzeń</ThemedText>
            <TextInput
              ref={repRepsInputRef}
              onSubmitEditing={() => timedExercisesInputRef.current?.focus()}
              keyboardType="numeric"
              enterKeyHint="next"
              // Todo: eventually remove default value
              defaultValue="10"
              maxLength={2}
              onChangeText={actions.setRepetitionExerciseRepetitionsCount}
              placeholder="1"
              placeholderTextColor={Colors.text.primaryDark}
              selectionColor={Colors.common.tint}
              style={styles.numericInput}
            />
          </View>
        </View>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          2. Ćwiczenia na czas:
        </ThemedText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '30%',
            }}
          >
            <ThemedText type="defaultSemiBold">Ile ćwiczeń</ThemedText>
            <TextInput
              ref={timedExercisesInputRef}
              onSubmitEditing={() => timedSetsInputRef.current?.focus()}
              keyboardType="numeric"
              enterKeyHint="next"
              // Todo: eventually remove default value
              defaultValue="1"
              maxLength={2}
              onChangeText={actions.setTimedExercisesCount}
              placeholder="10"
              placeholderTextColor={Colors.text.primaryDark}
              selectionColor={Colors.common.tint}
              style={styles.numericInput}
            />
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '30%',
            }}
          >
            <ThemedText type="defaultSemiBold">Ile serii</ThemedText>
            <TextInput
              ref={timedSetsInputRef}
              onSubmitEditing={() => timedDurationInputRef.current?.focus()}
              keyboardType="numeric"
              enterKeyHint="next"
              // Todo: eventually remove default value
              defaultValue="4"
              maxLength={2}
              onChangeText={actions.setTimedExerciseSetsCount}
              placeholder="1"
              placeholderTextColor={Colors.text.primaryDark}
              selectionColor={Colors.common.tint}
              style={styles.numericInput}
            />
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '30%',
            }}
          >
            <ThemedText type="defaultSemiBold">Czas trwania serii</ThemedText>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <TextInput
                ref={timedDurationInputRef}
                onSubmitEditing={() => exercisesBreakInputRef.current?.focus()}
                keyboardType="numeric"
                enterKeyHint="next"
                // Todo: eventually remove default value
                defaultValue="45"
                maxLength={3}
                onChangeText={actions.setTimedExerciseDuration}
                placeholder="45"
                placeholderTextColor={Colors.text.primaryDark}
                selectionColor={Colors.common.tint}
                style={styles.numericInput}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  position: 'absolute',
                  fontSize: 32,
                  lineHeight: 32,
                  left: 65,
                }}
              >
                sek.
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          3. Wybierz czas przerw
        </ThemedText>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '45%',
            }}
          >
            <ThemedText type="defaultSemiBold">Między ćwiczeniami:</ThemedText>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <TextInput
                ref={exercisesBreakInputRef}
                onSubmitEditing={() => setBreakInputRef.current?.focus()}
                keyboardType="numeric"
                enterKeyHint="next"
                // Todo: eventually remove default value
                defaultValue="90"
                maxLength={2}
                onChangeText={actions.setExercisesBreakDuration}
                placeholder="90"
                placeholderTextColor={Colors.text.primaryDark}
                selectionColor={Colors.common.tint}
                style={styles.numericInput}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  position: 'absolute',
                  fontSize: 32,
                  lineHeight: 32,
                  left: 65,
                }}
              >
                sek.
              </ThemedText>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '45%',
            }}
          >
            <ThemedText type="defaultSemiBold">Między seriami:</ThemedText>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <TextInput
                ref={setBreakInputRef}
                onSubmitEditing={onPressProceed}
                keyboardType="numeric"
                enterKeyHint="go"
                // Todo: eventually remove default value
                defaultValue="45"
                onChangeText={actions.setSetsBreakDuration}
                maxLength={2}
                placeholder="45"
                placeholderTextColor={Colors.text.primaryDark}
                selectionColor={Colors.common.tint}
                style={styles.numericInput}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  position: 'absolute',
                  fontSize: 32,
                  lineHeight: 32,
                  left: 65,
                }}
              >
                sek.
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Pressable
          onPress={onPressProceed}
          disabled={disabled}
          style={[{ width: '50%' }, disabled && { opacity: 0.75 }]}
        >
          <ThemedText type="defaultSemiBold" style={styles.forwardButton}>
            DALEJ
          </ThemedText>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  numericInput: {
    backgroundColor: Colors.common.primary,
    paddingVertical: 7,
    borderRadius: 2,
    width: 60,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '600',
  },
  forwardButton: {
    backgroundColor: Colors.common.primary,
    color: Colors.common.primaryLighter,
    width: '100%',
    fontSize: 24,
    borderRadius: 2,
    textAlign: 'center',
    padding: 10,
    marginTop: 25,
  },
});
