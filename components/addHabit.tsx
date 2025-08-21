import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FAB, Text, TextInput, Switch, Button, SegmentedButtons } from 'react-native-paper'
import { AddHabitItem, createHabit } from '../services/DbService';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import { TimeSlot } from '../utils/timeSlots';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const AddHabit = ({ onAddSuccess }: { onAddSuccess: () => void }) => {
    const { user } = useAuth();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState("");
    const [goal, setGoal] = useState("");
    const [value, setValue] = useState<TimeSlot>("morning");

    const reset = () => {
        setTitle("");
        setGoal("");
        setValue("morning");
        setIsSwitchOn(false);
        setShowAdd(false);
    }

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
            reminderSlot: value,
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
    <View style={styles.container}>
        <Text variant='headlineMedium' style={styles.heading}>Add Habit</Text>
        <View style={{ opacity: showAdd ? 1 : 0.5 }}>
            <TextInput style={{ marginVertical: 7, marginHorizontal: 40 }} activeOutlineColor='#03A688' disabled={!showAdd} mode='outlined' label='Title' placeholder='Habit to break' value={title} onChangeText={setTitle} />
            <TextInput style={{ marginHorizontal: 40 }} activeOutlineColor='#03A688' disabled={!showAdd} mode='outlined' keyboardType='number-pad' label='Goal' placeholder='Streak Goal' value={goal} onChangeText={setGoal} />
            <Text style={{ marginVertical: 5, textAlign: 'center', opacity: showAdd ? 1 : 0.5, color: '#011F26' }} variant='titleMedium'>Reminders?</Text>
            <Switch style={{ alignSelf: 'center' }} color='#03A688' disabled={!showAdd} value={isSwitchOn} onValueChange={() => setIsSwitchOn(!isSwitchOn)} />
            {isSwitchOn && (
                <SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    style={{paddingHorizontal: 45, paddingVertical: 10}}
                    buttons={[
                        {value: 'morning', label: 'Morning', style: value === 'morning' ? {backgroundColor: '#03A688'} : undefined},
                        {value: 'afternoon', label: 'Afternoon', style: value === 'afternoon' ? {backgroundColor: '#03A688'} : undefined},
                        {value: 'evening', label: 'Evening', style: value === 'evening' ? {backgroundColor: '#03A688'} : undefined}
                    ]}
                />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                <Button mode='contained' buttonColor='#F2668B' textColor='#011F26' style={{ flex: 0.2, marginRight: 5 }} disabled={!showAdd} onPress={() => newHabit()}>Submit</Button>
                <Button mode='contained' buttonColor='#3B94CA' textColor='#011F26' style={{ flex: 0.2, marginLeft: 5 }} disabled={!showAdd} onPress={reset}>Cancel</Button>
            </View>
            
        </View>

        {!showAdd && (
            <FAB
              icon="plus"
              label="Break a new habit"
              rippleColor='#026873'
              color='#011F26'
              style={styles.fab}
              onPress={() => setShowAdd(true)}
            />
        )}
    </View>
  )
}

export default AddHabit

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: '50%',
        transform: [{ translateY: 30 }],
        backgroundColor: '#03A688',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 15,
    },
    heading: {
        textAlign: 'center',
        paddingBottom: 5,
        color: '#011F26',
    },
})