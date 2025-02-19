import { StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useProjectStore } from '@/store/ProjectStore';
import { ProjectCard } from '@/components/ProjectCard';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { FlatList } from 'react-native';
import { Project } from '@/types/Project';

export default function HomeScreen() {
  const projects = useProjectStore((state) => state.projects);

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <ThemedText type="subtitle">No projects yet</ThemedText>
      <ThemedText>Tap the + button to create your first timelapse project</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/project/${item.id}`)}>
            <ProjectCard project={item} />
          </Pressable>
        )}
        contentContainerStyle={[
          styles.content,
          projects.length === 0 && styles.emptyContent
        ]}
        ListEmptyComponent={renderEmptyState}
        keyExtractor={(item) => item.id}
      />
      <FloatingActionButton
        onPress={() => router.push('/new-project')}
        icon="plus"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  emptyContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
}); 