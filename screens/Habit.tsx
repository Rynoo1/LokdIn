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
    const habitId = "miDd6V2kEBvximwn07Iv";

    const [safeWidth, setSafeWidth] = useState(0);
    const insets = useSafeAreaInsets();

    const subScreens = [
        { id: 'journal' },
        { id: 'streaks' }
    ]

    useFocusEffect(
        useCallback(() => {
            const { width: screenWidth } = Dimensions.get('window');
            setSafeWidth(screenWidth - insets.left - insets.right);
        },[insets.left, insets.right])
    );

    const renderScreens = ({ item }: { item: any }) => {
        return (
            <View style={{ width: safeWidth }}>
                {item.id === 'journal' && <Journal habitId={habitId} safeWidth={safeWidth} />}
                {item.id === 'streaks' && <Streaks habitId={habitId} safeWidth={safeWidth} />}
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
        />
    </SafeAreaView>
  )
}

export default Habit

const styles = StyleSheet.create({})