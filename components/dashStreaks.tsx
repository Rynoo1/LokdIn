import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import * as Progress from 'react-native-progress'
import { HabitStreakInfo } from "../types/habit";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//TODO: display habit name, streak progress and streak goal

const DashStreaks = ({ habitStreakData }: { habitStreakData: HabitStreakInfo[] }) => {

    const { width: screenWidth } = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const safeWidth = screenWidth - insets.left - insets.right;

    const streakRenderItem = useCallback(({ item }: { item: HabitStreakInfo}) => {
        return (
            <View>
                <Text>{item.title} Streak</Text>

                <View style={[styles.container, { width: safeWidth }]}>
                    <View style={[styles.half, { width: safeWidth }]}>
                        <Text>Streak Progress</Text>
                        <Progress.Circle size={200} indeterminate={false} progress={item.completion} showsText={true} style={{marginTop: 20}} />
                    </View>
                    <View style={[styles.half, { width: safeWidth }]}>
                        <Text>Streak Goal</Text>
                        <Text> {item.goal} </Text>
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
        overflow: 'hidden',
        backgroundColor: 'lightblue',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    half: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        minHeight: 200,
        overflow: 'hidden',
        backgroundColor: 'lightgreen',
    },
})