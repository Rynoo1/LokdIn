import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { getAllHabitStreak } from '../services/DbService';
import { useAuth } from '../contexts/authContext';
import { HabitStreakInfo } from '../types/habit';
import DashStreaks from '../components/dashStreaks';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Dashboard = () => {

  const { user } = useAuth();
  const [habitStreaks, setHabitStreaks] = useState<HabitStreakInfo[]>([]);

  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const safeWidth = screenWidth - insets.left - insets.right;

  useFocusEffect(
      React.useCallback(() => {
          handleGetData(user?.uid)

          return () => {

          };
      }, [])
  );

  const handleGetData = async (userId: string) => {
      var allData = await getAllHabitStreak(user?.uid);
      setHabitStreaks(allData);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#bdf26d59" }}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={safeWidth}
        snapToAlignment='start'
        decelerationRate='fast'
      >
        <View style={{ width: safeWidth }}>
          <DashStreaks habitStreakData={habitStreaks} />
        </View>

      </ScrollView>
      
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({})