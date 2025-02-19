import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Project } from '@/types/Project';
import { ProgressBar } from './ProgressBar';
import { router } from 'expo-router';

export function ProjectCard({ project }: { project: Project }) {
  const progress = project.currentImageCount / project.targetImageCount;
  const remaining = project.targetImageCount - project.currentImageCount;

  return (
    <Pressable onPress={() => router.push(`/project/${project.id}`)}>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">{project.name}</ThemedText>
        <ProgressBar progress={progress} />
        <ThemedView style={styles.stats}>
          <ThemedText>
            {project.currentImageCount} of {project.targetImageCount} photos
          </ThemedText>
          <ThemedText>
            {remaining} remaining
          </ThemedText>
        </ThemedView>
        {project.missedNotifications > 0 && (
          <ThemedText style={styles.missed}>
            Missed notifications: {project.missedNotifications}
          </ThemedText>
        )}
        <ThemedText style={styles.interval}>
          Every {project.intervalMinutes} minutes
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    backgroundColor: '#1C1C1E',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  missed: {
    color: '#ff6b6b',
  },
  interval: {
    opacity: 0.7,
  },
}); 