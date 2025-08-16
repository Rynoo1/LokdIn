import { Dimensions, FlatList, StyleSheet, View } from 'react-native'
import React, { useCallback } from 'react'
import * as Progress from 'react-native-progress'
import { HabitStreakInfo } from "../types/habit";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

//TODO: display habit name, streak progress and streak goal

const DashStreaks = ({ habitStreakData }: { habitStreakData: HabitStreakInfo[] }) => {

    const { width: screenWidth } = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const safeWidth = screenWidth - insets.left - insets.right;

    const streakRenderItem = useCallback(({ item }: { item: HabitStreakInfo}) => {
        return (
            <View>
                <Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 10 }}>{item.title} Streak</Text>
                
                <View style={styles.halvesContainer}>
                    <View style={[styles.container, { width: safeWidth }]}>
                        <View style={[styles.half, { width: safeWidth }]}>
                            <Text variant='titleLarge'>Streak Progress</Text>
                            <Progress.Circle size={200} color='#0554F2' indeterminate={false} progress={item.completion} showsText={true} style={{ marginTop: 20 }} />
                        </View>
                        <View style={[styles.half, { width: safeWidth }]}>
                            <Text variant='titleLarge' style={{ color: "#052608ff" }}>Streak Goal:</Text>
                            <Text variant='titleLarge' style={{ color: "#052608" }}> {item.goal} </Text>
                            <Text variant='titleLarge' style={{ marginTop: 35, color: "#052608" }}>Last Completed</Text>
                            <Text variant='titleLarge' style={{ color: "#052608" }}> {item.lastCompleted.toDate().toLocaleDateString()} </Text>
                        </View>
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