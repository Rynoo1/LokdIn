import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FAB, Text, TextInput, Switch, Button } from 'react-native-paper'
import { AddHabitItem, createHabit } from '../services/DbService';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';

const AddHabit = ({ onAddSuccess }: { onAddSuccess: () => void }) => {
    const { user } = useAuth();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState("");
    const [goal, setGoal] = useState("");

    const newHabit = async () => {
        if (!title || !goal) {
            alert("Please set a title or a streak goal");
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const addItem: AddHabitItem = {
            title: title!,
            goal: Number(goal),
            remindersOn: isSwitchOn,
            completed: false,
            currentStreak: 0,
            longestStreak: 0,
            dateLastStreak: Timestamp.fromDate(yesterday),
            startDate: Timestamp.now(),
            journalCount: 0,
        }
        const success = await createHabit(user?.uid, addItem)

        if (success) {
            setTitle("");
            setGoal("");
            setIsSwitchOn(false);
            setShowAdd(false);

            alert("Habit created!")
        } else {
            alert("Something went wrong");
        }
    }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', marginBottom: 30 }}>
        <Text variant='headlineMedium' style={{ textAlign: 'center', paddingBottom: 5 }}>Add Habit</Text>
        <View style={{ opacity: showAdd ? 1 : 0.7 }}>
            <TextInput style={{ marginVertical: 7, marginHorizontal: 40 }} disabled={!showAdd} mode='outlined' label='Title' placeholder='Habit to break' value={title} onChangeText={setTitle} />
            <TextInput style={{ marginHorizontal: 40 }} disabled={!showAdd} mode='outlined' keyboardType='number-pad' label='Goal' placeholder='Streak Goal' value={goal} onChangeText={setGoal} />
            <Text variant='titleMedium' style={{ marginVertical: 5, textAlign: 'center' }}>Reminders?</Text>
            <Switch style={{ alignSelf: 'center' }} disabled={!showAdd} value={isSwitchOn} onValueChange={() => setIsSwitchOn(!isSwitchOn)} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                <Button mode='contained-tonal' style={{ flex: 0.2, marginRight: 5 }} disabled={!showAdd} onPress={() => newHabit()}>Submit</Button>
                <Button mode='contained-tonal' style={{ flex: 0.2, marginLeft: 5 }} disabled={!showAdd} onPress={() => setShowAdd(false)}>Cancel</Button>
            </View>
            
        </View>

        {!showAdd && (
            <FAB
              icon="plus"
              label="Break a new habit"
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: '50%',
                transform: [{ translateY: 30}],
              }}
              onPress={() => setShowAdd(true)}
            />
        )}
    </View>
  )
}

export default AddHabit

const styles = StyleSheet.create({
    fab: {
        margin: 160,
        right: 0,
        bottom: 0,
    }
})