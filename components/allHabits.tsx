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
        <Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 10, marginTop: 15 }}>All Habits</Text>

        <View style={styles.container}>
            <Text variant='titleMedium' style={{ flex: 1 }}> Habit </Text>
            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}> Goal </Text>
            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}> Current </Text>
            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}> Longest </Text>
            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}> Journals </Text>
            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}> Reminders </Text>
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
                            <Text variant='titleMedium' style={{ flex: 1 }}>{item.title}</Text>
                            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}>{item.goal}</Text>
                            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}>{item.currentStreak}</Text>
                            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}>{item.longestStreak}</Text>
                            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}>{item.journalCount}</Text>
                            <Text variant='titleMedium' style={{ flex: 1, textAlign: "center" }}>{item.reminders ? item.reminderSlot : "Off"}</Text>                            
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
    }
})