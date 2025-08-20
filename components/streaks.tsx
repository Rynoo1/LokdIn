import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import { checkAndIncrementStreak, getStreak, HabitItem } from '../services/DbService'
import { useAuth } from '../contexts/authContext'
import { Button, Text, TextInput } from 'react-native-paper'
import HabitOverview from './habitOverview'
import EditHabit from './editHabit'

interface StreakProps {
    habitId: string;
    safeWidth: number;
    safeHeight: number;
}

const Streaks: React.FC<StreakProps> = ({ habitId, safeWidth, safeHeight }) => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [streakCompletion, setStreakCompletion] = useState(0);
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true);
    const [habitData, setHabitData] = useState();

    const fetchStreakData = async () => {
        try {
            setLoading(true);
            const completion = await getStreak(user?.uid, habitId);
            setStreakCompletion(completion.completion!);
            const habitWithId: HabitItem = {
                ...completion,
                id: habitId,
            };
            setStreakCompletion(habitWithId.completion!);
            setData(habitWithId);
            setLoading(false);
        } catch (error) {
            console.log("Error ", error);
        }
    };

    useEffect(() => {
        fetchStreakData();
    }, [habitId]);

    const updateStreak = async () => {
        try {
            const update = await checkAndIncrementStreak(user?.uid, habitId);
            Alert.alert("Streak", update.message);
        } catch (error) {
            console.log("Error ", error);
        }
        fetchStreakData();
    };

  return (
    <View style={[styles.container2, { width: safeWidth, height: safeHeight }]}>
        <View style={styles.halvesContainer2}>
            <View style={[styles.half2, { borderRightWidth: 2 }]}>
              <Text variant='headlineLarge'> Streak </Text>
              <Button mode='outlined' onPress={updateStreak} style={{ marginTop: 15 }}>Increase Streak</Button>
              <Progress.Circle size={200} indeterminate={false} progress={streakCompletion} showsText={true} style={{marginTop: 20}} />
            </View>
            <View style={[styles.half2, { marginTop: 25 }]}>
                {editing ? (
                    <EditHabit safeWidth={safeWidth} habitItem={data} onSaveSuccess={() => {
                        setEditing(false);
                        fetchStreakData();
                    }} />
                ) : (
                    <Button mode='contained-tonal' style={{ paddingHorizontal: 10 }} onPress={() => setEditing(true)}>Edit Habit</Button>
                )}
            </View>
        </View>
    </View>

  )
}

export default Streaks

const styles = StyleSheet.create({
    container2: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    halvesContainer2: {
        flexDirection: 'row',
        width: '100%',
        height: '100%'
    },
    half2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        overflow: 'hidden',
    },
})