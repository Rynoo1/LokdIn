import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/authContext';
import Journal from '../components/journal';
import { useRoute, RouteProp } from '@react-navigation/native';
import Streaks from '../components/streaks';
import { Dimensions } from 'react-native';

type HabitRouteParams = {
    habitId: string;
};

type HabitRouteProp = RouteProp<{ Habit: HabitRouteParams }, 'Habit'>;

const Habit = () => {

    const route = useRoute<HabitRouteProp>();
    const habitId = "miDd6V2kEBvximwn07Iv";

    const { width: screenWidth } = Dimensions.get('window');

    const subScreens = [
        { id: 'journal' },
        { id: 'streaks' }
    ]

    const renderScreens = ({ item }: { item: any }) => {
        return (
            <View style={{ width: screenWidth, flex: 1 }}>
                {item.id === 'journal' && <Journal habitId={habitId} />}
                {item.id === 'streaks' && <Streaks habitId={habitId} />}
            </View>
        );
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={subScreens}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth}
            bounces={false}
            renderItem={renderScreens}
        />
    </SafeAreaView>
  )
}

export default Habit

const styles = StyleSheet.create({})