import { StyleSheet, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/authContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { TextInput, Text, Button } from 'react-native-paper';
import { AuthStackParamList } from '../types/navigation';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { loginUser } = useAuth()!;
    const login = () => {
        loginUser(email, password);
    }

    // useEffect(() => {
    //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    //     return () => {
    //         ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    //     }
    // }, []);

    useFocusEffect(
        useCallback(() => {
            const lockToPortrait = async () => {
                await ScreenOrientation.unlockAsync();
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            };

            lockToPortrait();

        return () => {
            //ScreenOrientation.unlockAsync();
            //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };

        }, [])
    );

  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text variant='headlineLarge' style={{paddingBottom: 10}}>Log In</Text>
            
            <TextInput
                mode='outlined'
                placeholder='Your Email'
                onChangeText={newText => setEmail(newText)}
                defaultValue={email}
                keyboardType='email-address'
                />

            <TextInput
                mode='outlined'
                label="Password"
                placeholder='Password'
                onChangeText={newText => setPassword(newText)}
                defaultValue={password}
                secureTextEntry={!passwordVisible}
                right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} />}
                />

            <Button style={styles.buttonStyle} mode='contained-tonal' onPress={login}>
                Log In
            </Button>

            <Button style={styles.buttonStyle} mode='contained-tonal' onPress={() => navigation.replace("Register")}>
                Register
            </Button>

        </View>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    buttonStyle: {
        marginTop: 15,
    }
})