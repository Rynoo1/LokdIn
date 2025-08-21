import { Animated, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import * as Progress from 'react-native-progress'
import { HabitStreakInfo } from "../types/habit";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../types/navigation';

//TODO: display habit name, streak progress and streak goal

const DashStreaks = ({ habitStreakData, safeWidth, safeHeight }: { habitStreakData: HabitStreakInfo[]; safeWidth: number; safeHeight: number; }) => {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();

    const streakRenderItem = useCallback(({ item }: { item: HabitStreakInfo}) => {
        return (
            <View style={{height: safeHeight}}>
                <Text variant='headlineMedium' style={styles.heading}>{item.title} Streak</Text>
                <View style={styles.halvesContainer}>
                    <View style={[styles.container, { width: safeWidth }]}>
                        <TouchableOpacity style={[styles.half, { width: safeWidth }]} onPress={() => navigation.navigate("Habit", { habitId: `${item.id}` })}>
                            <Text variant='titleLarge' style={{ color: styles.label.color }}>Streak Progress</Text>
                            <Progress.Circle size={200} color='#F2668B' borderWidth={3.5} thickness={5} strokeCap='round' animated={true} indeterminate={false} progress={item.completion} showsText formatText={() => `${Math.round(item.completion * 100)}%`}  style={{ marginTop: 20 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.half, { width: safeWidth }]} onPress={() => navigation.navigate("Habit", { habitId: `${item.id}` })}>
                            <Text variant='titleLarge' style={{ color: styles.label.color }}>Streak Goal</Text>
                            <Text variant='titleLarge' style={[styles.content, { fontWeight: 'bold' }]}> {item.goal} <Text variant='titleLarge' style={{color: styles.label.color}}>Days</Text> </Text>
                            <Text variant='titleLarge' style={styles.label}>Current Streak</Text>
                            <Text variant='titleLarge' style={[styles.content, { fontWeight: 'bold' }]}> {item.currentStreak} <Text variant='titleLarge' style={{color: styles.label.color}}>Days</Text> </Text>
                            <Text variant='titleLarge' style={styles.label}>Last Completed</Text>
                            <Text variant='titleLarge' style={styles.content}> {item.lastCompleted.toDate().toLocaleDateString()} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, [safeWidth, navigation]);

  return (
    <View style={[styles.container, { width: safeWidth }]}>
        <FlatList
            data={habitStreakData}
            keyExtractor={(item) => item.id}
            renderItem={streakRenderItem}
            extraData={habitStreakData}
            snapToInterval={safeHeight}
            showsVerticalScrollIndicator={false}
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
    heading: {
        textAlign: 'center',
        marginTop: 15,
        color: "#011F26",
    },
    label: {
        color: "#026873",
        marginTop: 20,
    },
    content: {
        color: "#F2668B",
    }
})