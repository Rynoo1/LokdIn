# LokdIn

**Build Streaks, Break Habits**

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#-features">✨Features</a>
      <ul>
        <li><a href="#-habit-tracking">Habit Tracking</a></li>
        <li><a href="#-streak-goals">Streak Goals</a></li>
        <li><a href="#-streamlined-updates">Streamlined Updates</a></li>
        <li><a href="#%EF%B8%8F-audio-journaling">Audio Journaling</a></li>
      </ul>
    </li>
    <li><a href="#%EF%B8%8F-tech-stack">🛠️Tech Stack</a></li>
    <li>
        <a href="#-getting-started">🚀Getting Started</a>
        <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        </ul>
    </li>
    <li><a href="#-project-structure">📂Project Structure</a></li>
    <li><a href="#-usage">📱Usage</a></li>
  </ol>
</details>

<br/>

LokdIn is a habit-breaking app designed to help users overcome unwanted behaviour through structured tracking, goal setting, reminders and audio journaling. Users can track and manage multiple habits at once, each with their own audio journal, reminder set up and streak tracker and goals.


## ✨ Features

### 🎯 **Habit Tracking**
- Add and manage multiple habits you want to break
- Visual progress tracking with intuitive interface

### 🏆 **Streak Goals**
- Set a personalised streak goal for each habit
- Track your daily progress
- Celebrate milestones and achievements
- Visual indicators for goal progression

### 📊 **Streamlined Updates**
- Easy one-tap streak updates
- Setup reminder notifications for each habit

### 🎙️ **Audio Journaling**
- Record personal reflections for each habit
- Play back your journey and growth
- Reflect on your progress and setbacks


## 🛠️ Tech Stack

- **Frontend:** React Native with Expo
- **Backend & Services:** Firebase
    - **Authentication** (secure user login/signup)
    - **Firestore** (habit data, streaks, journal metadata)
    - **Firebase Storage** (audio journal storage)
- **Notifications:** Expo Notifications
- **Audio Recording:** Expo Audio
- **Navigation:** React Native Navigation
- **UI Library:** React Native Paper


## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher) & npm/yarn installed
- Expo CLI installed
- Firebase project setup
- React Native development environment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rynoo1/LokdIn.git
   cd LokdIn
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase configurations**
   ```bash
   # Create a Firebase project
   # Download your google-services.json (Android) and GoogleService-Info.plist (iOS)
   # Add your Firebase config to your environment variables
   ```

4. **Install Expo CLI globally** (if not already installed)
    ```bash
    npm install -g @expo/cli
    ```

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on device/simulator**
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS simulator
- Pres `a` for Android emulators 

## 📂 Project Structure
```bash
LokdIn/
│
├── assets/        # Images, icons and static files
├── components/    # Reusable UI components and sub screens
├── contexts/      # React context providers for global state
├── screens/       # App screens
├── services/      # Firebase services, notifications, etc.
├── types/         # TypeScript type definitions
├── utils/         # Helper functions and utilities
│
├── App.tsx        # Entry point of the app
├── firebase.tsx   # Firebase configuration and initialization
├── index.ts       # Expo entry file
├── app.json       # Expo configuration
├── package.json   # Dependencies and scripts
└── tsconfig.json  # TypeScript configuration
```

## 📱 Usage

### Adding a New Habit
1. Swipe to the Add Habit sub screen on the Dashboard
2. Tap the '+ Break a new habit' button
3. Enter your Habit details
    - Habit Name
    - Streak Goal
    - Reminders Settings  
5. Save and start tracking!

### Recording Audio Journals
1. Navigate to your habit from the main list or from the Streaks dashboard
2. Tap the 'Record Audio' button on the Journal sub screen
3. Record your thoughts and reflections
4. Save and access anytime for motivation

### Updating Your Streak
1. Navigate to your habit from the main list or from the Streaks dashboard
2. Swipe to the Streaks sub screen
3. Tap on the 'Increase Streak' button
4. Track your progress and celebrate your achievements!

**OR**

1. Access the Quick Update screen from startup (Keep your phone in portrait mode)
2. Tap on the 'Increase Streak' button for the specific habit to be increased

## Final Outcome

### Demo Video
