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
          {/* Title */}
          <Text style={styles.title}>LOGIN</Text>

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

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            <ImageBackground
              source={require('./assets/login button-Sheet.png')}
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
    backgroundColor: '#1a472a', // Pokémon green background as fallback
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