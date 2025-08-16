import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { startRecording, stopRecording, toggleAudio } from '../services/audioService';
import { useAuth } from '../contexts/authContext';
import { uploadAudio } from '../services/bucketService';
import { getHabitJournals } from '../services/DbService';
import { Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { Text } from 'react-native-paper';

interface JournalProps {
    habitId: string;
}

const Journal: React.FC<JournalProps> = ({ habitId }) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [playinStates, setPlayinStates] = useState<{ [key: string]: boolean }>({});

  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const safeWidth = screenWidth - insets.left - insets.right;

  const fetchData = async () => {
    const data = await getHabitJournals(user?.uid, habitId);
    setJournalEntries(data);
  };

  useEffect(() => {
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
        const recName = `journal_${new Date().toISOString()}.m4a`;
        const userId = user?.uid;
        const downloadUrl = await uploadAudio(userId, habitId, uri, recName);
        
        setStatus("Upload complete!");
        fetchData();

        console.log("File uploaded to: ", downloadUrl);
    } catch (error) {
        console.log("Error ", error);
        setStatus("Error during stop/upload: " + (error as Error).message);
    }
  };

  const handleToggle = async (id: string, audioUrl: string) => {
    const playing = await toggleAudio(audioUrl, () => {
        setPlayinStates((prev) => ({
            ...prev,
            [id]: false,
        }));
    });
    
    setPlayinStates((prev) => ({
        ...prev,
        [id]: playing,
    }));
  };

  return (
    <View style={[styles.container, { width: safeWidth }]}>

        <Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 10 }}> Journal </Text>

        <View style={styles.halvesContainer}>
            <View style={styles.half}>
                {journalEntries.length === 0 ? (
                    <Text> No journal entries yet </Text>
                ) : (
                    <FlatList
                        style={{ width: '100%' }}
                        contentContainerStyle={{ alignItems: 'center' }}
                        data={journalEntries}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isPlaying = playinStates[item.id] || false;

                            return (
                                <Button 
                                    icon={isPlaying ? "pause" : "play"}
                                    mode='outlined' 
                                    onPress={() => handleToggle(item.id, item.audioUrl)}
                                    style={{ margin: 5 }}
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
                    <Button icon='microphone' mode='contained-tonal' onPress={handleStart}> Record Audio </Button>
                ) : (
                    <Button icon='microphone-outline' mode='contained-tonal' onPress={handleStop}> Stop Recording </Button>
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
})