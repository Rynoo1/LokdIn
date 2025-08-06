import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { AuthProvider, useAuth } from './contexts/authContext';
import Dashboard from './screens/Dashboard';

const stack = createNativeStackNavigator();

function RootNavigator() {
  const { user } = useAuth()!;

  return (
    <NavigationContainer>
      { user ? (
        <stack.Navigator>
          <stack.Screen name='Dashboard' component={Dashboard} />
        </stack.Navigator>
      ): (
        <stack.Navigator>
          <stack.Screen name='Login' component={LoginScreen} />
          <stack.Screen name='Register' component={RegisterScreen} />
        </stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
