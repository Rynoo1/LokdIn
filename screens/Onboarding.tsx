import { Dimensions, FlatList, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Button, Text } from 'react-native-paper';

const { width } = Dimensions.get("window");

interface OnboardingScreenProps {
    onDone: () => void;
}

const slides = [
    { id: "1", title: "Welcome", subtitle: "This is", heading: "LokdIn", content: "Build streaks\nBreak habits", backgroundColor: "#011F26", color: "#e7effaff"},
    { id: "2", title: "Track Progress", subtitle: "Record the journey", heading: "", content: "Record audio journals to\ndocument your progress", backgroundColor: "#03A688", color: "#011F26"},
    { id: "3", title: "Build Streaks", subtitle: "Break Habits", heading: "", content: "Complete a habit after\nreaching your streak goal", backgroundColor: "#026873", color: "#011F26"},
];

const OnboardingScreen = ({ onDone }: OnboardingScreenProps) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [safeWidth, setSafeWidth] = useState(0);
    const [safeHeight, setSafeHeight] = useState(0);
    const insets = useSafeAreaInsets();


    const lockToPortrait = async () => {
        try {
            const available = await ScreenOrientation.supportsOrientationLockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

            if (available) {
                await ScreenOrientation.unlockAsync();
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            } else {
                console.warn('Portrait lock not supported');
            }

            const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
            const newWidth = screenWidth - insets.left - insets.right;
            const newHeight = screenHeight - insets.top - insets.bottom

            setSafeWidth(newWidth);
            setSafeHeight(newHeight);
        } catch (error) {
            console.error('lock failed', error);
        }

    };

    useEffect(() => {
        lockToPortrait();
    }, [safeHeight, safeWidth]);

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: slides[currentIndex].backgroundColor }}>
            <FlatList
                data={slides}
                ref={flatListRef}
                keyExtractor={(item) => item.id}
                horizontal
                snapToInterval={safeWidth}
                snapToAlignment='center'
                decelerationRate='fast'
                style={{flex: 1}}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item }) => (
                    <View style={{flex: 1}}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: safeWidth, paddingTop: 20 }}>
                            <Text variant='displayMedium' style={{ color: item.color}}>{item.title}</Text>
                            <Text variant='headlineMedium' style={{ marginTop: 10, color: item.color, textAlign: 'center'}}>{item.subtitle} { item.heading ? (<Text style={{color: '#F2668B', fontWeight: 'bold'}}>{item.heading}</Text>) : (null)}</Text>
                        </View>
                        <View style={{ flex: 1.5, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text variant='headlineMedium' style={{ color: '#e7effaff', textAlign: 'center'}}>{item.content}</Text>
                        </View>
                    </View>

                )}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                <Button mode='outlined' textColor='#e7effaff' style={{flex: 0.4, borderWidth: 2, borderColor: '#F2668B'}} onPress={onDone}>Skip</Button>
                {(currentIndex + 1 === slides.length) ? (
                    <Button mode='contained' buttonColor='#F2668B' style={{flex: 0.4, padding: 2}} onPress={onDone}>Done</Button>
                ) : (
                    <Button mode='contained' buttonColor='#F2668B' style={{flex: 0.4, padding: 2}} onPress={nextSlide}>Next</Button>
                )}
                
            </View>
            
    </SafeAreaView>
  );
}

export default OnboardingScreen

const styles = StyleSheet.create({})