import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import * as Progress from 'react-native-progress'
import { HabitStreakInfo } from "../types/habit";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../types/navigation';

//TODO: display habit name, streak progress and streak goal

const DashStreaks = ({ habitStreakData, safeWidth }: { habitStreakData: HabitStreakInfo[]; safeWidth: number; }) => {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();

    const streakRenderItem = useCallback(({ item }: { item: HabitStreakInfo}) => {
        return (
            <View>
                <Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 10 }}>{item.title} Streak</Text>
                <View style={styles.halvesContainer}>
                    <View style={[styles.container, { width: safeWidth }]}>
                        <TouchableOpacity style={[styles.half, { width: safeWidth }]} onPress={() => navigation.navigate("Habit", { habitId: `${item.id}` })}>
                            <Text variant='titleLarge'>Streak Progress</Text>
                            <Progress.Circle size={200} color='#0554F2' indeterminate={false} progress={item.completion} showsText={true} style={{ marginTop: 20 }} />
                            {/* <Text variant='titleSmall' style={{ color: "#052608ff" }}>Current</Text> */}
                        </TouchableOpacity>                        
                        <TouchableOpacity style={[styles.half, { width: safeWidth }]} onPress={() => navigation.navigate("Habit", { habitId: `${item.id}` })}>
                            <Text variant='titleLarge' style={{ color: "#052608ff" }}>Streak Goal:</Text>
                            <Text variant='titleLarge' style={{ color: "#052608" }}> {item.goal} </Text>
                            <Text variant='titleLarge' style={{ marginTop: 35, color: "#052608" }}>Last Completed</Text>
                            <Text variant='titleLarge' style={{ color: "#052608" }}> {item.lastCompleted.toDate().toLocaleDateString()} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, []);

  return (
    <View style={[styles.container, { width: safeWidth }]}>
        <FlatList
            data={habitStreakData}
            keyExtractor={(item) => item.id}
            renderItem={streakRenderItem}
        />
    </View>

  )
}

export default DashStreaks

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    halvesContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    half: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})