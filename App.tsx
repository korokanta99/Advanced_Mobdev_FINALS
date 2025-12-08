import React from 'react';
// 1. Redux Imports
import { Provider } from 'react-redux';
import { store } from './src/store';

// 2. Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 🛑 3. NEW IMPORT: Required to fix the Black Screen
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 4. Screen Imports
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
// import PokedexScreen from './PokedexScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    {/* <Stack.Screen name="Home" component={PokedexScreen} /> */}
  </Stack.Navigator>
);

const App = () => {
  return (
    <Provider store={store}>
      {/* 🛑 WRAPPER ADDED: This ensures the screen has a height > 0 */}
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;