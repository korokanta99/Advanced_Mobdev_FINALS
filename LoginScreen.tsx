import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
// 1. REMOVED: import firestore... (We use Redux now)
import Video from 'react-native-video';

// 2. NEW: Import Redux hooks and your Thunk
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './src/store/userSlice'; // Check this path!

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // 3. Get state from Redux
  const { isLoading, error, profile } = useSelector((state) => state.user);

  // 4. CHANGED: State to match secure Auth (Email & Password)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Listener: Navigate/Alert when login succeeds
  useEffect(() => {
    if (profile) {
      Alert.alert('Success', `Logged in as ${profile.email}`);
      // navigation.replace('Home'); // Uncomment this when you are ready to go to the main app
    }
  }, [profile]);

  // Listener: Show error if login fails
  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
    }
  }, [error]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    // 5. CONNECTED: Dispatch the secure login action
    dispatch(loginUser({ email, password }));
  };

  const handleRegistrationNavigation = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/* Video Background - Kept as requested since it works for you */}
      <Video
        source={require('./assets/pokemon-background.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true}
        muted={true}
        paused={false}
        playWhenInactive={false}
        playInBackground={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>LOGIN</Text>

          {/* INPUT 1: Email (Changed from Username) */}
          <ImageBackground
            source={require('./assets/inputs-Sheet.png')}
            style={styles.inputBackground}
            resizeMode="stretch">
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </ImageBackground>

          {/* INPUT 2: Password (Changed from Email) */}
          <ImageBackground
            source={require('./assets/inputs-Sheet.png')}
            style={styles.inputBackground}
            resizeMode="stretch">
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={true} // Hidden text for password
              editable={!isLoading}
            />
          </ImageBackground>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}>
            <ImageBackground
              source={require('./assets/login button-Sheet.png')}
              style={styles.button}
              resizeMode="stretch">
              {isLoading ? (
                <ActivityIndicator color="#8B4513" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </ImageBackground>
          </TouchableOpacity>

          {/* Don't have an account */}
          <TouchableOpacity
            style={styles.signupLink}
            onPress={handleRegistrationNavigation}>
            <Text style={styles.signupText}>Don't Have An Account?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#1a472a',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loginBox: {
    width: '85%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 60,
    letterSpacing: 4,
    fontFamily: 'VT323-Regular',
  },
  inputBackground: {
    width: '90%',
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 50,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'VT323-Regular',
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#8B4513',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'VT323-Regular',
  },
  signupLink: {
    marginTop: 30,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'VT323-Regular',
  },
});

export default LoginScreen;