import { Dimensions, FlatList, StyleSheet, View, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Button, Text } from 'react-native-paper';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

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

    // safe area-aware width/height; start as null/undefined so we can conditionally render
    const [safeWidth, setSafeWidth] = useState<number | null>(null);
    const [safeHeight, setSafeHeight] = useState<number | null>(null);
    const [background, setBackground] = useState(slides[0].backgroundColor);
    const insets = useSafeAreaInsets();

    const hexToRgb = (hex: string) => {
        const clean = hex.replace('#', '');
        const bigint = parseInt(clean.length === 6 ? clean : clean + clean, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    };

    const rgbToHex = (r: number, g: number, b: number) =>
        '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('').toUpperCase();

    const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

    const blendHex = (hexA:string, hexB: string, t: number) => {
        const A = hexToRgb(hexA);
        const B = hexToRgb(hexB);
        const r = lerp(A.r, B.r, t);
        const g = lerp(A.g, B.g, t);
        const b = lerp(A.b, B.b, t);
        return rgbToHex(r, g, b);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset?.x ?? 0;
        const page = pageWidth > 0 ? offsetX / pageWidth : 0;

        const baseIndex = Math.floor(page);
        const nextIndex = Math.ceil(page);

        const i = Math.max(0, Math.min(baseIndex, slides.length - 1));
        const j = Math.max(0, Math.min(nextIndex, slides.length - 1));

        const t = Math.max(0, Math.min(1, page - baseIndex));

        const colorA = slides[i].backgroundColor;
        const colorB = slides[j].backgroundColor;
        const blended = blendHex(colorA, colorB, t);

        setBackground(prev => (prev === blended ? prev : blended));
    };

    // lock to portrait once on mount and compute safe widths once (no dependency loop)
    useEffect(() => {
        (async () => {
            try {
                const available = await ScreenOrientation.supportsOrientationLockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                if (available) {
                    await ScreenOrientation.unlockAsync();
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                } else {
                    await ScreenOrientation.unlockAsync();
                    console.warn('Portrait lock not supported');
                }
            } catch (error) {
                console.error('lock failed', error);
            }

            const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
            const newWidth = Math.max(1, screenWidth - insets.left - insets.right);
            const newHeight = Math.max(1, screenHeight - insets.top - insets.bottom);

            setSafeWidth(newWidth);
            setSafeHeight(newHeight);
        })();
    }, []);

    const pageWidth = safeWidth ?? windowWidth;

    // Update current index from momentum end (more reliable for snapping)
    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset?.x ?? 0;
        if (pageWidth <= 0) return;
        const index = Math.round(offsetX / pageWidth);
        const clamped = Math.max(0, Math.min(index, slides.length - 1));
        setCurrentIndex(prev => (prev === clamped ? prev : clamped));
        setBackground(slides[clamped].backgroundColor);
    };

    const nextSlide = () => {
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        const offset = nextIndex * pageWidth;

        setBackground(slides[nextIndex].backgroundColor);
        flatListRef.current?.scrollToOffset({ offset, animated: true });
        setCurrentIndex(nextIndex);
    }

    const getItemLayout = (_: any, index: number) => ({
        length: pageWidth,
        offset: pageWidth * index,
        index,
    });

    if (safeWidth === null) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: slides[0].backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading…</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
            <FlatList
                data={slides}
                ref={flatListRef}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                snapToAlignment='center'
                decelerationRate='fast'
                style={{flex: 1}}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScroll={handleScroll}
                getItemLayout={getItemLayout}
                renderItem={({ item }) => (
                    <View style={{flex: 1, width: pageWidth}}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 }}>
                            <Text variant='displayMedium' style={{ color: item.color}}>{item.title}</Text>
                            <Text variant='headlineMedium' style={{ marginTop: 10, color: item.color, textAlign: 'center'}}>{item.subtitle} { item.heading ? (<Text style={{color: '#F2668B', fontWeight: 'bold'}}>{item.heading}</Text>) : (null)}</Text>
                        </View>
                        <View style={{ flex: 1.5, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text variant='headlineMedium' style={{ color: '#e7effaff', textAlign: 'center'}}>{item.content}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 8, paddingHorizontal: 16 }}>
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
