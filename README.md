# ManaLapse

ManaLapse is a mobile app built with Expo that helps users manage their timelapses efficiently. It provides notifications to remind users when to take the next photo in their timelapse sequence and offers an easy-to-use interface for organizing and tracking timelapse projects.

## 🚀 Features

- Set up and manage multiple timelapse projects
- Get notified when it's time to take the next photo
- Simple and intuitive UI for easy navigation

## 🛠️ Tech Stack

- **Expo** (React Native framework for cross-platform development)

## ❌ Issue with Notifications

ManaLapse was intended to use Expo Notifications to remind users when to take their next photo. However, due to compatibility issues with **Expo SDK 52**, notifications are currently non-functional. As of now, there is no reliable way to implement local notifications using this version of Expo, making it impossible to deliver the core feature of the app.

## 🔧 Potential Fixes

- Wait for a fix or update from Expo that resolves the issue with notifications in SDK 52
- Explore alternative solutions such as integrating a third-party push notification service outside of Expo
- Consider downgrading to a stable Expo version where notifications work reliably

## 📝 Status

Currently, the app is **not functional** due to the notification issue. If a fix becomes available, development may continue to restore the intended functionality.

## 📌 Future Plans

- Find a workaround for notifications
- Improve the UI and user experience
- Add additional features like cloud backup for timelapse projects

## 📩 Contributions & Feedback

If you have suggestions or know of a fix for the notification issue, feel free to contribute or share your insights!

