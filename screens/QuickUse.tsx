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

    useFocusEffect(
        useCallback(() => {
            handleGetData(user?.uid);
            return () => {

            }
        }, [user.uid])
    )

    const handleGetData = async (userId: string) => {
        var allData =  await getAllHabitStreak(userId);
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
      <Text variant='headlineLarge' style={{ textAlign: 'center' }}>Quick Use</Text>
      <ScrollView>
        {habitStreaks.map((item) =>(
            <View key={item.id} style={{flex: 1}}>
                <Text variant='headlineSmall' style={{textAlign: 'center', marginTop: 20}}>{item.title}</Text>
                <Button mode='contained' style={{ paddingVertical: 5, marginHorizontal: 10, alignSelf: 'center' }} onPress={() => handleUpdateStreak(user.uid, item.id)}>Increment Streak</Button>
            </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default QuickUse

const styles = StyleSheet.create({})