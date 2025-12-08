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
  ScrollView,
} from 'react-native';

// 1. VIDEO IMPORT (Restored)
import Video from 'react-native-video';

// 2. REDUX IMPORTS (Backend Logic)
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from './src/store/userSlice';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // Get state from Redux
  const { isLoading, error, profile } = useSelector((state) => state.user);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');

  // Listener: Success
  useEffect(() => {
    if (profile) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'Login Now', onPress: () => navigation.navigate('Login') },
      ]);
    }
  }, [profile, navigation]);

  // Listener: Error
  useEffect(() => {
    if (error && !isLoading) {
      Alert.alert('Registration Failed', error);
    }
  }, [error, isLoading]);

  const handleRegister = () => {
    // Input Validation
    if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // CONNECTED: Dispatch the Secure Signup Action
    dispatch(signupUser({ email, password, username: userName, gender }));
  };

  return (
    <View style={styles.container}>
      {/* 🟢 VIDEO RESTORED: This should play your background now */}
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.registerBox}>
            <Text style={styles.title}>REGISTER</Text>
            <Text style={styles.subtitle}>Enter your training card</Text>

            {/* Username Input */}
            <ImageBackground
              source={require('./assets/inputs-Sheet.png')}
              style={styles.inputBackground}
              resizeMode="stretch">
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </ImageBackground>

            {/* Email Input */}
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

            {/* Password Input */}
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
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </ImageBackground>

            {/* Confirm Password Input */}
            <ImageBackground
              source={require('./assets/inputs-Sheet.png')}
              style={styles.inputBackground}
              resizeMode="stretch">
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </ImageBackground>

            {/* Gender Selection */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Select Gender:</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('male')}
                  disabled={isLoading}>
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'male' && styles.genderButtonTextActive,
                    ]}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('female')}
                  disabled={isLoading}>
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'female' && styles.genderButtonTextActive,
                    ]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}>
              <ImageBackground
                source={require('./assets/login button-Sheet.png')}
                style={styles.button}
                resizeMode="stretch">
                {isLoading ? (
                  <ActivityIndicator color="#8B4513" />
                ) : (
                  <Text style={styles.buttonText}>SIGN UP</Text>
                )}
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Already Have An Account?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  registerBox: {
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
    marginBottom: 10,
    letterSpacing: 4,
    fontFamily: 'VT323-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 40,
    fontFamily: 'VT323-Regular',
  },
  inputBackground: {
    width: '90%',
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
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
    marginTop: 20,
  },
  buttonText: {
    color: '#8B4513',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'VT323-Regular',
  },
  loginLink: {
    marginTop: 30,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'VT323-Regular',
  },
  genderContainer: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  genderLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'VT323-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  genderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    minWidth: 100,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#fff',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'VT323-Regular',
    fontWeight: 'bold',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
});

export default RegisterScreen;