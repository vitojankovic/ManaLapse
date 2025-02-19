/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from '@/hooks/useColorScheme';

const Colors = {
  background: '#121212', // Dark background
  text: '#FFFFFF', // White text
  tint: '#007AFF', // iOS blue for interactive elements
  tabIconDefault: '#666666',
  tabIconSelected: '#007AFF',
  card: '#1C1C1E', // Slightly lighter than background for cards
  border: '#323232', // Subtle borders
  notification: '#FF453A',
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  return Colors[colorName];
}

export { Colors };
