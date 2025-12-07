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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';

const LoginScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Input validation
    if (!userName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please enter both username and email');
      return;
    }

    setLoading(true);

    try {
      // Query Firestore for user with matching username
      const userSnapshot = await firestore()
        .collection('users')
        .where('userName', '==', userName)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        Alert.alert('Login Failed', 'Invalid username or email');
        setLoading(false);
        return;
      }

      // Get the user document
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Check if email matches
      if (userData.email === email) {
        Alert.alert('Success', `Welcome back, ${userData.userName}!`);
        
        // Navigate to your main app screen
        // navigation.navigate('Home', { userId: userDoc.id, userData });
        
        // Clear inputs
        setUserName('');
        setEmail('');
      } else {
        Alert.alert('Login Failed', 'Invalid username or email');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={require('../assets/background-video.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true}
        muted={true}
        paused={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View style={styles.loginBox}>
          {/* Title */}
          <Text style={styles.title}>LOGIN</Text>

          {/* Username Input */}
          <ImageBackground
            source={require('../assets/inputs-Sheet.png')} // Your blue pokeball input
            style={styles.inputBackground}
            resizeMode="stretch">
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#rgba(255,255,255,0.6)"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              editable={!loading}
            />
          </ImageBackground>

          {/* Email Input */}
          <ImageBackground
            source={require('../assets/inputs-Sheet.png')} // Your blue pokeball input (same image)
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

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            <ImageBackground
              source={require('../assets/login button-Sheet.png')} // Your orange/yellow button
              style={styles.button}
              resizeMode="stretch">
              {loading ? (
                <ActivityIndicator color="#8B4513" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </ImageBackground>
          </TouchableOpacity>

          {/* Don't have an account */}
          <TouchableOpacity style={styles.signupLink}>
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
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slight overlay for readability
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  inputBackground: {
    width: '90%',
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 50, // Space for pokeball icon on left
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#8B4513', // Dark brown for orange button
    fontSize: 20,
    fontWeight: 'bold',
  },
  pikachu: {
    width: 120,
    height: 120,
    position: 'absolute',
    bottom: 80,
    right: 20,
    resizeMode: 'contain',
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
  },
});

export default LoginScreen;