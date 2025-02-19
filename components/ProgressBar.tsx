import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View 
        style={[
          styles.progress, 
          { 
            backgroundColor: tintColor,
            width: `${Math.min(progress * 100, 100)}%` 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E1E1',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
}); 