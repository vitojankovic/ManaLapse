export interface Image {
  id: string
  uri: string
  timestamp: string
}

export interface Project {
  id: string
  name: string
  targetImageCount: number
  intervalMinutes: number
  createdAt: string
  currentImageCount: number
  status: "active" | "paused" | "completed"
  missedNotifications: number
  images: Image[]
  nextNotificationTime?: string | null
}

