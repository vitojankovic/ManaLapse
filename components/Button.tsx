import { StyleSheet, Pressable, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: tintColor,
          text: '#fff',
        };
      case 'secondary':
        return {
          bg: 'transparent',
          text: tintColor,
        };
      case 'danger':
        return {
          bg: '#ff4444',
          text: '#fff',
        };
    }
  };

  const colors = getColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.bg,
          opacity: pressed ? 0.8 : 1,
          borderColor: variant === 'secondary' ? tintColor : 'transparent',
        },
      ]}
      onPress={onPress}>
      <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 