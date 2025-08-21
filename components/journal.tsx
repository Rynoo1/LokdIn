import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { startRecording, stopRecording, toggleAudio } from '../services/audioService';
import { useAuth } from '../contexts/authContext';
import { uploadAudio } from '../services/bucketService';
import { getHabitJournals, getHabitTitle } from '../services/DbService';
import { Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { Text } from 'react-native-paper';

interface JournalProps {
    habitId: string;
    safeWidth: number;
}

const Journal: React.FC<JournalProps> = ({ habitId, safeWidth }) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [habitName, setHabitName] = useState("");

  const fetchData = async () => {
    const data: any[] = await getHabitJournals(user?.uid, habitId);
    
    const sorted = data.sort((a, b) => {
        const dateA = a.name.replace("Journal-", "").replace(".m4a", "").replace(/\//g, "-");
        const dateB = b.name.replace("Journal-", "").replace(".m4a", "").replace(/\//g, "-");
        return new Date(dateA).getTime() - new Date (dateB).getTime();
    });

    setJournalEntries(sorted);
  };  

  useEffect(() => {
    const fetchName = async () => {
        const habName = await getHabitTitle(user.uid, habitId);
        if (habName) {
            setHabitName(await(habName.title));
        }
    }
    fetchData();
    fetchName();
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
        const recName = `Journal-${new Date().toLocaleDateString()}.m4a`;
        const userId = user?.uid;
        const downloadUrl = await uploadAudio(userId, habitId, uri, recName);
        
        setStatus("Upload complete!");
        alert("Upload complete!");
        fetchData();

        console.log("File uploaded to: ", downloadUrl);
    } catch (error) {
        console.log("Error ", error);
        setStatus("Error during stop/upload: " + (error as Error).message);
        alert("Error during stop/upload: " + (error as Error).message);
    }
  };

  const handleToggle = async (id: string, audioUrl: string) => {
    const playing = await toggleAudio(audioUrl, () => {
        setCurrentlyPlaying(null);
    });

    setCurrentlyPlaying(playing ? id : null);
  };

  return (
    <View style={[styles.container, { width: safeWidth }]}>

        <Text variant='headlineMedium' style={styles.heading}>{habitName} Journal </Text>

        <View style={styles.halvesContainer}>
            <View style={styles.half}>
                {journalEntries.length === 0 ? (
                    <Text variant='headlineSmall' style={{ textAlign: 'center' }}> No journal entries yet </Text>
                ) : (
                    // <View>

                        <FlatList
                            style={{ width: '100%' }}
                            contentContainerStyle={{ alignItems: 'center' }}
                            data={journalEntries}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isPlaying = currentlyPlaying === item.id;

                                return (
                                    <Button 
                                        icon={isPlaying ? "pause" : "play"}
                                        mode='outlined'
                                        textColor='#026873'
                                        onPress={() => handleToggle(item.id, item.audioUrl)}
                                        style={{ margin: 5, borderColor: '#03A688', borderWidth: 1.5 }}
                                    >
                                        {item.name}
                                    </Button>
                                );
                            }}
                        />

                )}

            </View>
            <View style={[styles.half, { borderLeftWidth: 2 }]}>
                {!isRecording ? (
                    <Button icon='microphone' mode='contained' buttonColor='#F2668B' onPress={handleStart}> Record Audio </Button>
                ) : (
                    <Button icon='microphone-outline' mode='outlined' textColor='#026873' style={{borderColor: '#F2668B', borderWidth: 2}} onPress={handleStop}> Stop Recording </Button>
                )}
            </View>
        </View>
    </View>
  )
}

export default Journal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        alignItems: 'center',
    },
    halvesContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    half: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        overflow: 'hidden',
        paddingTop: 20,
    },
    heading: {
        textAlign: 'center', 
        marginBottom: 10,
        color: '#011F26'
    },
})