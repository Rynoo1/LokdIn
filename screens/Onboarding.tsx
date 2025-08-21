import { Dimensions, FlatList, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get("window");

interface OnboardingScreenProps {
    onDone: () => void;
    onSkip: () => void;
}

const slides = [
    { id: "1", title: "Welcome", subtitle: "This is LokdIn"},
    { id: "2", title: "Track Habits", subtitle: "Stay consistent"},
    { id: "3", title: "Get Started", subtitle: "Start breaking your bad habits"},
];

const OnboardingScreen = ({ onDone, onSkip }: OnboardingScreenProps) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length -1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1});
        } else {
            onDone();
        }
    };

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

  return (
    <View>
        <FlatList
            data={slides}
            ref={flatListRef}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item }) => (
                <View style={{ width: width, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{item.title}</Text>
                    <Text>{item.subtitle}</Text>
                </View>
            )}
        />
    </View>
  );
}

export default OnboardingScreen

const styles = StyleSheet.create({})