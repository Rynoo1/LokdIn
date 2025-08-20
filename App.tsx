import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { AuthProvider, useAuth } from './contexts/authContext';
import Dashboard from './screens/Dashboard';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useRef, useState } from 'react';
import QuickUse from './screens/QuickUse';
import Habit from './screens/Habit';
import { Audio } from 'expo-av';
import * as Notifications from "expo-notifications";
import { getUserHabits } from './services/DbService';
import { scheduleHabitSlotReminders } from './services/notificationService';

const stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


function RootNavigator() {
  const { user } = useAuth()!;
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [showDash, setShowDash] = useState(false);
  const subscriptionRef = useRef<ScreenOrientation.Subscription | null>(null);
  const hasCheckedOrientation = useRef(false);

  useEffect(() => {
    if (!user) return;

    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Enable notifications to receive habit reminders!");
      }
    };

    requestPermissions();

    const initNotifications = async () => {
      try {
        const habitItems = await getUserHabits(user.uid);

        await scheduleHabitSlotReminders(habitItems);
        console.log("Notifications on startup");
      } catch (error) {
        console.log("Notification error on startup ", error);
      }
    };

    const handleOrientationChange = (orientation: ScreenOrientation.Orientation) => {
      console.log('Orientation changed:', orientation);
      if (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
            console.log("switching to dashboard (landscape detected");
            setShowDash(true);

            if (subscriptionRef.current) {
              console.log('Removing orientation listener');
              ScreenOrientation.removeOrientationChangeListener(subscriptionRef.current);
              subscriptionRef.current = null;
            }
        }
    };

    const init = async () => {
      if (hasCheckedOrientation.current) return;

      try {
        const currentOrientation = await ScreenOrientation.getOrientationAsync();
        console.log("Initial orientation:", currentOrientation);
        hasCheckedOrientation.current = true;

        handleOrientationChange(currentOrientation);

        subscriptionRef.current = ScreenOrientation.addOrientationChangeListener((event) => {
          handleOrientationChange(event.orientationInfo.orientation);
        });
        console.log("added orientation change listener");

      } catch (error) {
        console.error("Error getting orientation ", error);
      }
    };

    init();
    initNotifications();

    return () => {
      if (subscriptionRef.current) {
        console.log('Cleanup: Removing orientation listener');
        ScreenOrientation.removeOrientationChangeListener(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user, showDash]);

  return (
    <NavigationContainer>
      { user ? (
          showDash ? (
            <stack.Navigator>
              <stack.Screen options={{ headerShown: false }} name='Dashboard' component={Dashboard} />
              <stack.Screen options={{ headerShown: false }} name='Habit' component={Habit} />
            </stack.Navigator>
          ) : (
            <stack.Navigator>
              <stack.Screen name='QuickAccess' component={QuickUse} />
            </stack.Navigator>
          )
      ) : (
        <stack.Navigator>
          <stack.Screen name='Login' component={LoginScreen} />
          <stack.Screen name='Register' component={RegisterScreen} />
        </stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
