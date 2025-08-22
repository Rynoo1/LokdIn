import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './contexts/authContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from "expo-notifications";
import { getUserHabits } from './services/DbService';
import { scheduleHabitSlotReminders } from './services/notificationService';
import { checkOnboarded, setOnboarded } from './services/onboarding';


import QuickUse from './screens/QuickUse';
import Habit from './screens/Habit';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Onboarding from './screens/Onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './screens/Onboarding';

const ONBOARDING_KEY = "hasOnboarded";
const Stack = createNativeStackNavigator();

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
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
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
      const onboarded = await checkOnboarded();
      setHasOnboarded(onboarded);

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
      {!hasOnboarded ? (
        <Stack.Navigator screenOptions={{contentStyle: { backgroundColor: '#e7effaff'}}}>
          <Stack.Screen name='Onboarding' options={{ headerShown: false }}>
            {() => (
              <OnboardingScreen
                onDone={async () => {
                  await setOnboarded();
                  setHasOnboarded(true);
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : user ? (
          showDash ? (
            <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#e7effaff' }}}>
              <Stack.Screen options={{ headerShown: false }} name='Dashboard' component={Dashboard} />
              <Stack.Screen options={{ headerShown: false }} name='Habit' component={Habit} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#e7effaff' }}}>
              <Stack.Screen options={{ headerShown: false }} name='QuickAccess' component={QuickUse} />
            </Stack.Navigator>
          )
      ) : (
        <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#e7effaff' }}}>
          <Stack.Screen options={{ headerShown: false }} name='Login' component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name='Register' component={RegisterScreen} />
        </Stack.Navigator>
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
