import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addCaughtPokemon } from './src/store/userSlice'; // Import the action

const ScanScreen = () => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // Get params passed from MapScreen
  const { pokemonId, pokemonImage } = route.params as any || {};

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  const handleCapture = () => {
    if (pokemonId) {
      // 1. Save to Redux
      dispatch(addCaughtPokemon(pokemonId));
      
      // 2. Show Success Message
      Alert.alert("Gotcha!", "The Pokémon was added to your Pokedex!", [
        { text: "OK", onPress: () => navigation.navigate('Home') } // Go back to Pokedex
      ]);
    } else {
        navigation.goBack();
    }
  };

  if (!device || !hasPermission) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.overlay}>
        <Text style={styles.arText}>WILD POKEMON FOUND!</Text>
        
        {/* Render the specific Pokemon found on the map */}
        {pokemonImage ? (
             <Image source={{ uri: pokemonImage }} style={styles.pokemonSprite} />
        ) : (
             <Text style={{color: 'white'}}>Scanning...</Text>
        )}
        
        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
           <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>RUN AWAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  arText: { 
    position: 'absolute', top: 50, color: '#FFF', 
    fontFamily: 'VT323-Regular', fontSize: 30, textShadowRadius: 4 
  },
  pokemonSprite: { width: 200, height: 200, resizeMode: 'contain' },
  captureBtn: {
    position: 'absolute', bottom: 50, width: 80, height: 80,
    borderRadius: 40, borderWidth: 4, borderColor: '#FFF',
    justifyContent: 'center', alignItems: 'center'
  },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'red' },
  closeBtn: {
    position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10
  },
  btnText: { color: '#FFF', fontFamily: 'VT323-Regular', fontSize: 20 }
});

export default ScanScreen;