import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { startRecording, stopRecording } from '../services/audioService';
import { useAuth } from '../contexts/authContext';
import { uploadAudio } from '../services/bucketService';
import Journal from '../components/journal';
import { useRoute, RouteProp } from '@react-navigation/native';

type HabitRouteParams = {
    habitId: string;
};

type HabitRouteProp = RouteProp<{ Habit: HabitRouteParams }, 'Habit'>;

const Habit = () => {
    const route = useRoute<HabitRouteProp>();
    const habitId = "S8v1fwHArPXuNt1fs58DXOqodIQ2";
    const { user } = useAuth();
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState("");

    const handleStart = async () => {
        try {
            setStatus("Starting recording...");
            await startRecording();
            setIsRecording(true);
            setStatus("Recording...");
        } catch (error) {
            setStatus((error as Error).message);
        }
    };

    const handleStop = async () => {
        try {
            setStatus("Stopping recording...");
            const uri = await stopRecording();
            setIsRecording(false);

            setStatus("Uploading...");
            const recName = `journal_${Date.now()}.m4a`;
            const userId = user?.uid;
            const downloadUrl = await uploadAudio(userId, uri, recName);

            setStatus("Upload complete!");

            console.log("File uploaded to: ", downloadUrl);
        } catch (error) {
            console.log("Error ", error);
            setStatus("Error during stop/upload: " + (error as Error).message);
        }
    };

  return (
    <SafeAreaView>
        <Journal habitId={habitId} />
    </SafeAreaView>
  )
}

export default Habit

const styles = StyleSheet.create({})