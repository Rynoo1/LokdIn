import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import { checkAndIncrementStreak, getStreak } from '../services/DbService'
import { useAuth } from '../contexts/authContext'

interface StreakProps {
    habitId: string,
}

const Streaks: React.FC<StreakProps> = ({ habitId }) => {
    const { user } = useAuth();
    const [streakCompletion, setStreakCompletion] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchStreakData = async () => {
        try {
            setLoading(true);
            const completion = await getStreak(user?.uid, habitId);
            setStreakCompletion(completion);
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
    <View>
      <Text>Streak</Text>
      <TouchableOpacity onPress={updateStreak}>
        <Text>Increase Streak</Text>
      </TouchableOpacity>
      <Progress.Circle size={200} indeterminate={false} progress={streakCompletion} showsText={true} style={{marginTop: 20}} />
    </View>
  )
}

export default Streaks

const styles = StyleSheet.create({})