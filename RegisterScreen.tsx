import React, { useState } from 'react';
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
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';

const RegisterScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(''); // 'male' or 'female'
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Input validation
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

    setLoading(true);

    try {
      // Check if username already exists
      const userSnapshot = await firestore()
        .collection('users')
        .where('userName', '==', userName)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        Alert.alert('Registration Failed', 'Username already exists');
        setLoading(false);
        return;
      }

      // Check if email already exists
      const emailSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!emailSnapshot.empty) {
        Alert.alert('Registration Failed', 'Email already registered');
        setLoading(false);
        return;
      }

      // Create new user
      await firestore()
        .collection('users')
        .add({
          userName,
          email,
          password, // Note: In production, you should hash passwords!
          gender,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to login screen
            // navigation.navigate('Login');
          },
        },
      ]);

      // Clear inputs
      setUserName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setGender('');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
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
            {/* Title */}
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
                editable={!loading}
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
                editable={!loading}
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
                editable={!loading}
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
                editable={!loading}
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
                  disabled={loading}>
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
                  disabled={loading}>
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
              disabled={loading}
              activeOpacity={0.8}>
              <ImageBackground
                source={require('./assets/login button-Sheet.png')}
                style={styles.button}
                resizeMode="stretch">
                {loading ? (
                  <ActivityIndicator color="#8B4513" />
                ) : (
                  <Text style={styles.buttonText}>SIGN UP</Text>
                )}
              </ImageBackground>
            </TouchableOpacity>

            {/* Already have an account */}
            <TouchableOpacity style={styles.loginLink}>
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