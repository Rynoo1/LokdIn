import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/authContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AuthStackParamList } from '../types/navigation';
import { Button, Text, TextInput } from 'react-native-paper';

const RegisterScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const { registerUser } = useAuth()!;
    const register = () => {
        registerUser(email, password);
    }

    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

                return () => {

                };
        }, [])
    );
        
        // return () => {
        //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        // }
    // };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1, justifyContent: 'center', marginBottom: '50%' }}>
            <Text variant='headlineLarge' style={{paddingBottom: 10, color: '#011F26'}}>Register</Text>
            
            <TextInput
                mode='outlined'
                label='Email'
                placeholder='Your Email'
                onChangeText={newText => setEmail(newText)}
                defaultValue={email}
                keyboardType='email-address'
                activeOutlineColor='#03A688'
                />

            <TextInput
                mode='outlined'
                label="Password"
                placeholder='Password'
                onChangeText={newText => setPassword(newText)}
                defaultValue={password}
                secureTextEntry={!passwordVisible}
                activeOutlineColor='#03A688'
                right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} />}
                />

            <Button style={styles.buttonStyle} mode='contained' buttonColor='#F2668B' onPress={register}>
                Register
            </Button>

            <Button style={[styles.buttonStyle, {borderColor: '#F2668B'}]} textColor='#F2668B' mode='outlined' onPress={() => navigation.replace("Login")}>
                Log In
            </Button>            

        </View>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 15,
    }
})