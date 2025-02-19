import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Project } from "@/types/Project";

// Configure notifications for both foreground and background
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions at startup
async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get notification permissions");
    return false;
  }

  return true;
}

// Initialize permissions
requestNotificationPermissions();

export function scheduleNextNotification(project: Project) {
  if (project.status !== "active") return null;

  // Cancel any existing notifications first
  Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();
  const nextTime = new Date(now.getTime() + project.intervalMinutes * 60 * 1000);

  // Schedule with exact timing
  Notifications.scheduleNotificationAsync({
    content: {
      title: `Time for your ${project.name} timelapse!`,
      body: `Take photo ${project.currentImageCount + 1} of ${project.targetImageCount}`,
      data: { projectId: project.id },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      date: nextTime,
      seconds: project.intervalMinutes * 60,
    },
  });

  return nextTime;
}

interface ProjectStore {
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "images" | "currentImageCount" | "status" | "missedNotifications">,
  ) => void;
  addImageToProject: (projectId: string, imageUri: string) => void;
  deleteProject: (projectId: string) => void;
  pauseProject: (projectId: string) => void;
  resumeProject: (projectId: string) => void;
}

export const useProjectStore = create(
  persist<ProjectStore>(
    (set, get) => ({
      projects: [],

      addProject: (project) => {
        const newProject: Project = {
          id: Date.now().toString(),
          ...project,
          createdAt: new Date().toISOString(),
          currentImageCount: 0,
          status: "active",
          missedNotifications: 0,
          images: [],
        };

        const nextNotification = scheduleNextNotification(newProject);
        if (nextNotification) {
          newProject.nextNotificationTime = nextNotification.toISOString();
        }

        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },

      addImageToProject: (projectId, imageUri) => {
        set((state) => {
          const projects = [...state.projects];
          const index = projects.findIndex((p) => p.id === projectId);
          if (index === -1) return state;

          const updatedProject = { ...projects[index] };

          // Add the new image
          updatedProject.images.push({
            id: Date.now().toString(),
            uri: imageUri,
            timestamp: new Date().toISOString(),
          });
          updatedProject.currentImageCount++;

          // Check if project is completed
          if (updatedProject.currentImageCount >= updatedProject.targetImageCount) {
            updatedProject.status = "completed";
            // Cancel notifications if completed
            Notifications.cancelAllScheduledNotificationsAsync();
          } else {
            // Schedule next notification
            const nextNotification = scheduleNextNotification(updatedProject);
            if (nextNotification) {
              updatedProject.nextNotificationTime = nextNotification.toISOString();
            }
          }

          projects[index] = updatedProject;
          return { projects };
        });
      },

      pauseProject: (projectId) => {
        set((state) => {
          const projects = [...state.projects];
          const index = projects.findIndex((p) => p.id === projectId);
          if (index === -1) return state;

          const updatedProject = {
            ...projects[index],
            status: "paused",
            nextNotificationTime: null, // Clear next notification time
          };

          // Cancel only this project's notifications
          Notifications.cancelAllScheduledNotificationsAsync();

          projects[index] = updatedProject;
          return { projects };
        });
      },

      resumeProject: (projectId) => {
        set((state) => {
          const projects = [...state.projects];
          const index = projects.findIndex((p) => p.id === projectId);
          if (index === -1) return state;

          const updatedProject = {
            ...projects[index],
            status: "active",
          };

          // Schedule next notification immediately
          const nextNotification = scheduleNextNotification(updatedProject);
          if (nextNotification) {
            updatedProject.nextNotificationTime = nextNotification.toISOString();
          }

          projects[index] = updatedProject;
          return { projects };
        });
      },

      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        }));
        Notifications.cancelAllScheduledNotificationsAsync();
      },
    }),
    {
      name: "project-store",
      storage: {
        getItem: async (name) => {
          const result = await AsyncStorage.getItem(name);
          return result ? JSON.parse(result) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);