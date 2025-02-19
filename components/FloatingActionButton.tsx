import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: string;
}

export function FloatingActionButton({ onPress, icon }: FloatingActionButtonProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <Pressable 
      style={styles.button} 
      onPress={onPress}
    >
      <Ionicons name="add" size={24} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 