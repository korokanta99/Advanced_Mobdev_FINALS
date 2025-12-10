import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 🛑 FIX 1: Import the screen!
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';
import PokedexScreen from './PokedexScreen';
import CommunityScreen from './CommunityScreen';
import MapScreen from './MapScreen';
import ScanScreen from './ScanScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />

    {/* 🛑 FIX 2: Add the route named "Home" */}
    <Stack.Screen name="Home" component={PokedexScreen} />
    <Stack.Screen name="Community" component={CommunityScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;