import { useWindowDimensions } from 'react-native';

type Breakpoint = 'mobile' | 'small' | 'medium' | 'large';

interface ResponsiveValue<T> {
  mobile?: T;
  small?: T;
  medium?: T;
  large?: T;
  default: T;
}

export const useResponsiveValue = <T>(values: ResponsiveValue<T>): T => {
  const { width } = useWindowDimensions();

  const getBreakpoint = (): Breakpoint => {
    if (width >= 1024 && 'large' in values) return 'large';
    if (width >= 768 && 'medium' in values) return 'medium';
    if (width >= 640 && 'small' in values) return 'small';
    return 'mobile';
  };

  const breakpoint = getBreakpoint();

  return values[breakpoint] ?? values.default;
};
