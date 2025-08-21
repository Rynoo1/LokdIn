import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, SegmentedButtons, Switch, Text, TextInput } from 'react-native-paper'
import { editHabitData, HabitItem } from '../services/DbService'
import { useAuth } from '../contexts/authContext'
import { useNavigation } from '@react-navigation/native'
import { TimeSlot } from '../utils/timeSlots'

interface EditProps {
    safeWidth: number,
    habitItem: HabitItem,
    onSaveSuccess: () => void
}

const EditHabit: React.FC<EditProps> = ({ safeWidth, habitItem, onSaveSuccess }) => {
    const { user } = useAuth();
    const [isSwitchOn, setIsSwitchOn] = useState<boolean>(habitItem.reminders!);
    const [title, setTitle] = useState(habitItem.title || "");
    const [goal, setGoal] = useState(habitItem.goal?.toString() || "0");
    const [slot, setSlot] = useState(habitItem.reminderSlot || "");

    const width = safeWidth/2;
    const onToggleSwtich = () => setIsSwitchOn(!isSwitchOn);

    const updateHabit = async () => {
        if (!user || !habitItem.id) return;

        const updatedHabit: HabitItem = {
            id: habitItem.id,
            title: title,
            goal: Number(goal),
            reminders: isSwitchOn,
            reminderSlot: slot as TimeSlot,
        };

        const success = await editHabitData(user.uid, updatedHabit);

        if (success) {
            console.log("Habit updated successfully!");
            alert("Successfully updated Habit!");
            onSaveSuccess();
        } else {
            console.log("Failed to update habit");
            console.log(slot, habitItem.reminderSlot);
            alert("Something went wrong");
        }
    }

  return (
    <View style={{ flex: 1, width: width, paddingHorizontal: 20 }}>
        <View>
            <Text variant='headlineLarge' style={{ textAlign: 'center', color: '#011F26' }}>Edit Habit</Text>
            <TextInput style={{ marginVertical: 5 }} mode='outlined' activeOutlineColor='#03A688' label='Title' value={title} onChangeText={setTitle} />
            <TextInput mode='outlined' activeOutlineColor='#03A688' keyboardType='numeric' label='Goal' value={goal} onChangeText={setGoal} />
            <Text variant='titleMedium' style={{ marginVertical: 5, textAlign: 'center' }}>Reminders</Text>
            <Switch style={{ alignSelf: 'center' }} color='#03A688' value={isSwitchOn} onValueChange={onToggleSwtich} />
            {isSwitchOn && (
                <SegmentedButtons
                    value={slot}
                    onValueChange={setSlot}
                    density='medium'
                    style={{paddingVertical: 10}}
                    buttons={[
                        {value: 'morning', label: 'Morning', style: slot === 'morning' ? {backgroundColor: '#03A688'} : undefined},
                        {value: 'afternoon', label: 'Afternoon', style: slot === 'afternoon' ? {backgroundColor: '#03A688'} : undefined},
                        {value: 'evening', label: 'Evening', style: slot === 'evening' ? {backgroundColor: '#03A688'} : undefined}
                    ]}
                />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                <Button mode='contained' buttonColor='#F2668B' style={{ flex: 1, marginRight: 5 }} onPress={updateHabit}>Submit</Button>
                <Button mode='contained' buttonColor='#3B94CA' style={{ flex: 1, marginLeft: 5 }} onPress={() => onSaveSuccess()}>Cancel</Button>
            </View>
        </View>
    </View>
  )
}

export default EditHabit

const styles = StyleSheet.create({})