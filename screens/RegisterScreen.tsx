import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/authContext';

type RootStackParamList = {
    Login: undefined;
};

const RegisterScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { registerUser } = useAuth()!;
    const register = () => {
        registerUser(email, password);
    }

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

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text>Login</Text>
            </TouchableOpacity>               

        </View>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})