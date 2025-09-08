import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { getAllHabitStreak } from '../services/DbService';
import { useAuth } from '../contexts/authContext';
import { ExtendedHabitInfo, HabitStreakInfo } from '../types/habit';
import DashStreaks from '../components/dashStreaks';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import AllHabits from '../components/allHabits';
import { Text } from 'react-native-paper';
import AddHabit from '../components/addHabit';

const Dashboard = () => {

  const { user } = useAuth();
  const [habitStreaks, setHabitStreaks] = useState<ExtendedHabitInfo[]>([]);
  const [safeWidth, setSafeWidth] = useState(0);
  const [safeHeight, setSafeHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
      React.useCallback(() => {

        const lockToLandscape = async () => {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }

        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        setSafeWidth(screenWidth - insets.left - insets.right);
        setSafeHeight(screenHeight - insets.top - insets.bottom);

        handleGetData(user?.uid);
        lockToLandscape();

      return () => {

      };

      }, [insets.left, insets.right])
  );

  const handleGetData = async (userId: string) => {
      var allData = await getAllHabitStreak(userId);
      setHabitStreaks(allData);
  }
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetData(user?.uid).finally(() => setRefreshing(false));
  }, []);

  if (safeWidth === 0) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1  }}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={safeWidth}
        snapToAlignment='start'
        decelerationRate='fast'
      >
        <View style={{ width: safeWidth, height: safeHeight }}>
          <DashStreaks habitStreakData={habitStreaks} safeWidth={safeWidth} safeHeight={safeHeight} refreshing={refreshing} onRefresh={onRefresh} />
        </View>

        <View style={{ width: safeWidth, height: safeHeight }}>
          <AllHabits habitData={habitStreaks} refreshing={refreshing} onRefresh={onRefresh} />
        </View>

        <View style={{ width: safeWidth, height: safeHeight }}>
          <AddHabit onAddSuccess={() => {handleGetData(user.uid)}} />
        </View>

      </ScrollView>
      
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginTop: 15,
    color: "#011F26",
  },
  text: {
    textAlign: 'center',
    marginTop: 15,
    color: "#F2668B",
  }
})