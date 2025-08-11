import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { playAudio, startRecording, stopRecording } from '../services/audioService';
import { useAuth } from '../contexts/authContext';
import { uploadAudio } from '../services/bucketService';
import { getHabitJournals } from '../services/DbService';

interface JournalProps {
    habitId: string;
}

const Journal: React.FC<JournalProps> = ({ habitId }) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getHabitJournals(habitId);
        setJournalEntries(data);
    }
    fetchData();
  }, [habitId]);

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
        <View>
            {journalEntries.length === 0 ? (
                <Text> No journal entries yet </Text>
            ) : (
                <FlatList
                    data={journalEntries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => playAudio(item.downloadUrl)}>
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            
        </View>
        <View>
            <Text>Habits</Text>
            {!isRecording ? (
                <TouchableOpacity onPress={handleStart}>
                    <Text>Record Audio</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleStop}>
                    <Text>Stop Recording</Text>
                </TouchableOpacity>
            )}
            
        </View>
    </SafeAreaView>
  )
}

export default Journal

const styles = StyleSheet.create({})