import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/authContext';
import Journal from '../components/journal';
import { useRoute, RouteProp } from '@react-navigation/native';
import Streaks from '../components/streaks';

type HabitRouteParams = {
    habitId: string;
};

type HabitRouteProp = RouteProp<{ Habit: HabitRouteParams }, 'Habit'>;

const Habit = () => {

    const route = useRoute<HabitRouteProp>();
    const habitId = "miDd6V2kEBvximwn07Iv";

  return (
    <SafeAreaView>
        {/* <Journal habitId={habitId} /> */}
        <Streaks habitId={habitId} />
    </SafeAreaView>
  )
}

export default Habit

const styles = StyleSheet.create({})