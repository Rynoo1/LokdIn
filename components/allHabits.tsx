import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ExtendedHabitInfo } from '../types/habit';
import { getAllHabitStreak } from '../services/DbService';
import { useAuth } from '../contexts/authContext';
import { Text } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../types/navigation';

const AllHabits = ({ habitData }: { habitData: ExtendedHabitInfo[] }) => {

    const { user } = useAuth();
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <View>
        <Text variant='headlineMedium' style={styles.heading}>All Habits</Text>

        <View style={styles.container}>
            <Text variant='titleLarge' style={{ flex: 1, color: styles.titles.color }}> Habit </Text>
            <Text variant='titleLarge' style={styles.titles}> Goal </Text>
            <Text variant='titleLarge' style={styles.titles}> Current </Text>
            <Text variant='titleLarge' style={styles.titles}> Longest </Text>
            <Text variant='titleLarge' style={styles.titles}> Journals </Text>
            <Text variant='titleLarge' style={styles.titles}> Reminders </Text>
        </View>
        <ScrollView>
            {habitData.map((item) => (
                <View
                    key={item.id}
                    style={{
                        padding: 16,
                        borderRadius: 8,
                    }}
                >
                    <View>
                        <TouchableOpacity style={styles.content} onPress={() => navigation.navigate("Habit", { habitId: `${item.id}` })}>
                            <Text variant='titleLarge' style={styles.label}>{item.title}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.goal}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.currentStreak}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.longestStreak}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.journalCount}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.reminders ? item.reminderSlot.charAt(0).toUpperCase() + item.reminderSlot.slice(1) : "Off"}</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            ))}
        </ScrollView>
    </View>
  )
}

export default AllHabits

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    content: {
        flexDirection: "row",
        paddingVertical: 8,
    },
    titles: {
        flex: 1,
        textAlign: 'center',
        color: "#03A688",
    },
    label: {
        color: "#026873",
        flex: 1,
    },
    items: {
        color: "#F2668B",
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    heading: {
        textAlign: 'center', 
        marginBottom: 10, 
        marginTop: 15, 
        color: '#011F26'
    }
})