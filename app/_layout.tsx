import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useProjectStore } from '@/store/ProjectStore';

export default function RootLayout() {
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    // Set up notification listeners
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const projectId = response.notification.request.content.data.projectId;
      if (projectId) {
        router.push(`/project/${projectId}`);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          headerTintColor: '#FFFFFF',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Timelapse Projects',
          }}
        />
        <Stack.Screen
          name="new-project"
          options={{
            title: 'New Project',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="project/[id]"
          options={{
            title: 'Project Details',
          }}
        />
      </Stack>
    </>
  );
} 