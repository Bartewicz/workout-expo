import type { Centiseconds } from '@/utils/types/time';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type TimerProps = {
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
  fontSize: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const TimeFormatter = (time: number, fontSize: number, textStyle: StyleProp<TextStyle>) => {
  const timeStr = (time / 100).toString();

  const [secondsRaw, centiSecondsRaw = '00'] = timeStr.split('.');
  const centiSeconds = centiSecondsRaw.length === 1 ? centiSecondsRaw + '0' : centiSecondsRaw;
  const secondsNum = Number(secondsRaw);
  const minutes = Math.floor(secondsNum / 60);
  const seconds = minutes > 0 ? (secondsNum % 60).toString().padStart(2, '0') : secondsNum % 60;

  const translateX =
    minutes > 9
      ? (2 / 3) * fontSize
      : minutes > 0
        ? (2 / 5) * fontSize
        : secondsNum < 10
          ? (-1 / 6) * fontSize
          : 0;
  const containerPosition: StyleProp<ViewStyle> = {
    transform: [{ translateX }],
  };

  if (minutes > 0) {
    return (
      <View style={[{ position: 'relative', flexDirection: 'row' }, containerPosition]}>
        <ThemedText style={[textStyle, styles.absolute, { right: (4 / 15) * fontSize }]}>
          {minutes}:{seconds}
        </ThemedText>
        <ThemedText style={textStyle}>.</ThemedText>
        <ThemedText style={[textStyle, styles.absolute, { left: (4 / 15) * fontSize }]}>
          {centiSeconds}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[{ position: 'relative' }, containerPosition]}>
      <ThemedText style={[textStyle, styles.absolute, { right: (4 / 15) * 30 }]}>
        {seconds}
      </ThemedText>
      <ThemedText style={textStyle}>.</ThemedText>
      <ThemedText style={[textStyle, styles.absolute, { left: (4 / 15) * 30 }]}>
        {centiSeconds}
      </ThemedText>
    </View>
  );
};

export const Timer = ({ state, containerStyle, textStyle, fontSize }: TimerProps) => {
  const timePassedRef = useRef<Centiseconds | null>(null);
  const [time, setTime] = useState<Centiseconds>(0);

  const advanceTimer = useCallback(
    (_relativeStartTime: number) => () => {
      setTime(Math.floor((Date.now() - _relativeStartTime) / 10));
    },
    [],
  );

  useEffect(() => {
    let timerIntervalRef: ReturnType<typeof setInterval>;
    if (state === 'running') {
      let _relativeStartTime = Date.now();

      if (!!timePassedRef.current) {
        _relativeStartTime = Date.now() - timePassedRef.current * 10;
      }

      timerIntervalRef = setInterval(advanceTimer(_relativeStartTime), 10);

      return () => {
        clearInterval(timerIntervalRef);
      };
    }

    if (state === 'paused') {
      timePassedRef.current = time;
    }

    if (state === 'uninitialised') {
      setTime(0);
      timePassedRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return <View style={containerStyle}>{TimeFormatter(time, fontSize, textStyle)}</View>;
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
});
