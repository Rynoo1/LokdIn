import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { getAllHabitStreakAndFix } from '../services/DbService';
import { useAuth } from '../contexts/authContext';
import { ExtendedHabitInfo, HabitStreakInfo } from '../types/habit';
import DashStreaks from '../components/dashStreaks';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import AllHabits from '../components/allHabits';
import { Appbar, Text } from 'react-native-paper';
import AddHabit from '../components/addHabit';

const Dashboard = () => {

  const { user } = useAuth();
  const [habitStreaks, setHabitStreaks] = useState<ExtendedHabitInfo[]>([]);
  const [safeWidth, setSafeWidth] = useState(0);
  const [safeHeight, setSafeHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const [refreshing, setRefreshing] = useState(false);
  const [appbarHeight, setAppbarHeight] = useState(56);
  const [availableHeight, setAvailableHeight] = useState( windowHeight - insets.top - insets.bottom - appbarHeight);

  useEffect(() => {
    setAvailableHeight(windowHeight - insets.top - insets.bottom - appbarHeight);
  }, [windowHeight, insets.top, insets.bottom, appbarHeight]);

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
      var allData = await getAllHabitStreakAndFix(userId);
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
          <Appbar.Header style={{ backgroundColor: '#e7effaff' }} onLayout={e => setAppbarHeight(e.nativeEvent.layout.height)}>
            <Appbar.Content title="Streaks" titleStyle={{ fontSize: 30, lineHeight: 36, color: '#011F26' }} />
          </Appbar.Header>
          <DashStreaks habitStreakData={habitStreaks} safeWidth={safeWidth} safeHeight={availableHeight} refreshing={refreshing} onRefresh={onRefresh} />
        </View>

        <View style={{ width: safeWidth, height: safeHeight }}>
          <Appbar.Header style={{ backgroundColor: '#e7effaff'}}>
            <Appbar.Content title="All Habits" titleStyle={{ fontSize: 30, lineHeight: 36, color: '#011F26' }} />
          </Appbar.Header>
          <AllHabits habitData={habitStreaks} refreshing={refreshing} onRefresh={onRefresh} />
        </View>

        <View style={{ width: safeWidth, height: safeHeight }}>
          <Appbar.Header style={{ backgroundColor: '#e7effaff'}}>
            <Appbar.Content title="Add Habit" titleStyle={{ fontSize: 30, lineHeight: 36, color: '#011F26' }} />
          </Appbar.Header>
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