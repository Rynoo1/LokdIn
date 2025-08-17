import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/authContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AuthStackParamList } from '../types/navigation';

const RegisterScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
    <SafeAreaView>
        <View>
            <Text>Register</Text>
            
            <TextInput
                placeholder='Your Email'
                onChangeText={newText => setEmail(newText)}
                defaultValue={email}
                keyboardType='email-address'
                />

            <TextInput
                placeholder='Password'
                onChangeText={newText => setPassword(newText)}
                defaultValue={password}
                secureTextEntry={true}
                />

            <TouchableOpacity onPress={register}>
                <Text>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace("Login")}>
                <Text>Login</Text>
            </TouchableOpacity>               

        </View>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})