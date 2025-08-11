import { Audio } from "expo-av";

let recording: Audio.Recording | null = null;
let currentSound: Audio.Sound | null = null;

// Start recording audio
export const startRecording = async (): Promise<void> => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission?.status !== 'granted') {
        throw new Error("Microphone permission not granted");
    }

    await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
    });
    
    const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

    recording = newRecording;
};


// stop audio recording
export const stopRecording = async (): Promise<string> => {
    if (!recording) throw new Error("No active recording");
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    if (!uri) throw new Error("Failed to get recording URI");
    return uri;
};


// start audio playback
export const playAudio = async (url: string) => {
    try {
        if (currentSound) {
            await currentSound.unloadAsync();
            currentSound = null;
        }

        const { sound } = await Audio.Sound.createAsync({ uri: url });
        currentSound = sound;
        await sound.playAsync();
    } catch (error) {
        console.error("Error playing audio ", error);
    }
};


// stop audio playback
export const stopAudio = async () => {
    if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        currentSound = null;
    }
};