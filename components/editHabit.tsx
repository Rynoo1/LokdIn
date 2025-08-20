import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Switch, Text, TextInput } from 'react-native-paper'
import { editHabitData, HabitItem } from '../services/DbService'
import { useAuth } from '../contexts/authContext'
import { useNavigation } from '@react-navigation/native'

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
    const width = safeWidth/2;
    const onToggleSwtich = () => setIsSwitchOn(!isSwitchOn);

    const updateHabit = async () => {
        if (!user || !habitItem.id) return;

        const updatedHabit: HabitItem = {
            id: habitItem.id,
            title: title,
            goal: Number(goal),
            reminders: isSwitchOn,
        };

        const success = await editHabitData(user.uid, updatedHabit);

        if (success) {
            console.log("Habit updated successfully!");
            onSaveSuccess();
        } else {
            console.log("Failed to update habit");
        }
    }

  return (
    <View style={{ flex: 1, width: width, paddingHorizontal: 20 }}>
        <View>
            <Text variant='headlineMedium' style={{ textAlign: 'center' }}>Edit Habit</Text>
            <TextInput style={{ marginVertical: 5 }} mode='outlined' label='Title' value={title} onChangeText={setTitle} />
            <TextInput mode='outlined' keyboardType='numeric' label='Goal' value={goal} onChangeText={setGoal} />
            <Text variant='titleMedium' style={{ marginVertical: 5, textAlign: 'center' }}>Reminders</Text>
            <Switch style={{ alignSelf: 'center' }} value={isSwitchOn} onValueChange={onToggleSwtich} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                <Button mode='contained-tonal' style={{ flex: 1, marginRight: 5 }} onPress={updateHabit}>Submit</Button>
                <Button mode='contained-tonal' style={{ flex: 1, marginLeft: 5 }} onPress={() => onSaveSuccess()}>Cancel</Button>
            </View>
        </View>
    </View>
  )
}

export default EditHabit

const styles = StyleSheet.create({})