import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useAuth } from '../contexts/authContext'
import { ExtendedHabitInfo } from '../types/habit';
import { useFocusEffect } from '@react-navigation/native';
import { checkAndIncrementStreak, getAllHabitStreak } from '../services/DbService';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

//TODO: Load all habits from the db - title, currentStreak?
//TODO: Increase streak button

const QuickUse = () => {
    const { user } = useAuth();
    const [habitStreaks, setHabitStreaks] = useState<ExtendedHabitInfo[]>([]);
    const [incrementedMap, setIncrementedMap] = useState<{ [id: string]: boolean }>({});

    useFocusEffect(
        useCallback(() => {
            handleGetData(user?.uid);
            return () => {

            }
        }, [user.uid, incrementedMap])
    )

    const handleGetData = async (userId: string) => {
        var allData =  await getAllHabitStreak(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newIncrementedMap: { [id: string]: boolean } = {};

        allData.forEach((habit) => {
            const lastStreak = habit.lastCompleted.toDate();
            lastStreak.setHours(0, 0, 0, 0);
            const daysDifference = Math.floor((today.getTime() - lastStreak.getTime()) / (1000 * 60 * 60 * 24));

            newIncrementedMap[habit.id] = daysDifference === 1;
        });

        setIncrementedMap(newIncrementedMap);
        setHabitStreaks(allData);
    };

    const handleUpdateStreak = async (userId: string, habitId: string) => {
        const inc = checkAndIncrementStreak(userId, habitId);
        if ((await inc).streakIncremented) {
            alert((await inc).message);
        } else {
            alert((await inc).message);
        }
    }

  return (
    <SafeAreaView style={{flex: 1, margin: 10}}>
      <Text variant='headlineLarge' style={{ textAlign: 'center', color: '#011F26' }}>Quick Use</Text>
      <ScrollView>
        {habitStreaks.map((item) =>(
            <View key={item.id} style={{ flex: 1, marginBottom: 10 }}>
                <Text variant='headlineSmall' style={{textAlign: 'center', marginTop: 20, color: '#026873'}}>{item.title}</Text>
                {!incrementedMap[item.id] ? (
                    <Button mode='outlined' textColor='#F2668B' style={{ paddingVertical: 5, marginVertical: 5, alignSelf: 'center', borderColor: '#F2668B', borderWidth: 3 }} onPress={() => handleUpdateStreak(user.uid, item.id)}>Increment Streak</Button>
                ) : (
                    <Button mode='contained' buttonColor='#F2668B' style={{ paddingVertical: 5, marginVertical: 5, alignSelf: 'center', borderWidth: 3 }} onPress={() => handleUpdateStreak(user.uid, item.id)}>Increment Streak</Button>
                )}
            </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default QuickUse

const styles = StyleSheet.create({})