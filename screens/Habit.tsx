import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/authContext';
import Journal from '../components/journal';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import Streaks from '../components/streaks';
import { Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

type HabitRouteParams = {
    habitId: string;
};

type HabitRouteProp = RouteProp<{ Habit: HabitRouteParams }, 'Habit'>;

const Habit = () => {

    const route = useRoute<HabitRouteProp>();
    const habitId = route.params.habitId;

    const [safeWidth, setSafeWidth] = useState(0);
    const [safeHeight, setSafeHeight] = useState(0);
    const insets = useSafeAreaInsets();

    const subScreens = [
        { id: 'journal' },
        { id: 'streaks' }
    ]

    useFocusEffect(
        useCallback(() => {
            const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
            setSafeWidth(screenWidth - insets.left - insets.right);
            setSafeHeight(screenHeight - insets.top - insets.bottom);
        },[insets.left, insets.right])
    );

    const renderScreens = ({ item }: { item: any }) => {
        return (
            <View style={{ width: safeWidth }}>
                {item.id === 'journal' && <Journal habitId={habitId} safeWidth={safeWidth} />}
                {item.id === 'streaks' && <Streaks habitId={habitId} safeWidth={safeWidth} safeHeight={safeHeight} />}
            </View>
        );
    };

  return (
    <SafeAreaView>
        <FlatList
            data={subScreens}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={safeWidth}
            bounces={false}
            renderItem={renderScreens}
            style={{ height: safeHeight, paddingVertical: 10 }}
        />
    </SafeAreaView>
  )
}

export default Habit

const styles = StyleSheet.create({})