import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useProjectStore } from '@/store/ProjectStore';

export default function NewProjectScreen() {
  const [name, setName] = useState('');
  const [targetCount, setTargetCount] = useState('');
  const [interval, setInterval] = useState('');
  const addProject = useProjectStore((state) => state.addProject);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    const count = parseInt(targetCount, 10);
    const mins = parseInt(interval, 10);

    if (isNaN(count) || count <= 0) {
      Alert.alert('Error', 'Please enter a valid number of photos');
      return;
    }

    if (isNaN(mins) || mins <= 0) {
      Alert.alert('Error', 'Please enter a valid interval in minutes');
      return;
    }

    try {
      await addProject({
        name: name.trim(),
        targetImageCount: count,
        intervalMinutes: mins,
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create project');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">New Timelapse Project</ThemedText>
      
      <TextInput
        placeholder="Project Name"
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="next"
      />
      
      <TextInput
        placeholder="Number of Photos"
        value={targetCount}
        onChangeText={setTargetCount}
        keyboardType="number-pad"
        returnKeyType="next"
      />
      
      <TextInput
        placeholder="Interval (minutes)"
        value={interval}
        onChangeText={setInterval}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={handleCreate}
      />
      
      <Button onPress={handleCreate} title="Create Project" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
}); 