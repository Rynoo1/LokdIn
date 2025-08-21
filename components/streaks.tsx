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
    const [data, setData] = useState({});
    const [startDate, setStartDate] = useState<string | undefined>('');
    const [loading, setLoading] = useState(true);

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
            setStartDate(completion.dateStarted?.toDate().toDateString());
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
              <Text variant='headlineLarge' style={{color: '#011F26'}}> Streak </Text>
              <Button mode='outlined' onPress={updateStreak} textColor='#026873' style={{ marginTop: 15, borderColor: '#03A688', borderWidth: 1.5 }}>Increase Streak</Button>
              <Progress.Circle size={200} color='#F2668B' borderWidth={3} thickness={4} strokeCap='round' indeterminate={false} progress={streakCompletion} showsText={true} style={{marginTop: 20}} />
            </View>
            <View style={styles.half2}>
                {editing ? (
                    <EditHabit safeWidth={safeWidth} habitItem={data} onSaveSuccess={() => {
                        setEditing(false);
                        fetchStreakData();
                    }} />
                ) : (
                    <View style={{width: '100%'}}>
                        <Text variant='headlineLarge' style={{color: '#011F26', marginBottom: 15, textAlign: 'center'}}>{data.title}</Text>

                        <View style={{flexDirection: 'row', justifyContent: 'center', marginLeft: 50 }}>
                            
                            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                                <Text variant='titleMedium' style={{ color: '#026873', marginTop: 5 }}>Date Started:</Text>
                                <Text variant='titleMedium' style={{ color: '#026873', marginTop: 5 }}>Streak Goal:</Text>
                                <Text variant='titleMedium' style={{ color: '#026873', marginTop: 5 }}>Current Streak:</Text>
                                <Text variant='titleMedium' style={{ color: '#026873', marginTop: 5 }}>Longest Streak:</Text>
                                <Text variant='titleMedium' style={{ color: '#026873', marginTop: 5 }}>Reminders:</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                                <Text variant='titleMedium' style={{ color: '#F2668B', fontWeight: 'bold', marginTop: 5 }}>{startDate}</Text>
                                <Text variant='titleMedium' style={{ color: '#F2668B', fontWeight: 'bold', marginTop: 5 }}>{data.goal} days</Text>
                                <Text variant='titleMedium' style={{ color: '#F2668B', fontWeight: 'bold', marginTop: 5 }}>{data.currentStreak} days</Text>
                                <Text variant='titleMedium' style={{ color: '#F2668B', fontWeight: 'bold', marginTop: 5 }}>{data.longestStreak} days</Text>
                                <Text variant='titleMedium' style={{ color: '#F2668B', fontWeight: 'bold', marginTop: 5 }}>{data.reminders ? data.reminderSlot.charAt(0).toUpperCase() + data.reminderSlot.slice(1) + "s" : "Off"}</Text>
                            </View>
                        </View>

                        <Button mode='contained' style={{ alignSelf: 'center', paddingHorizontal: 5, marginTop: 20 }} buttonColor='#03A688' onPress={() => setEditing(true)}>Edit Habit</Button>
                    </View>

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
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 15,
    },
})