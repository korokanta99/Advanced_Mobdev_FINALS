import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { useNavigation, useRoute } from '@react-navigation/native';

// Set sensor update speed
setUpdateIntervalForType(SensorTypes.gyroscope, 50);

const ScanScreen = () => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Gyroscope state for "VR-lite" movement
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Target Pokemon (passed from Map or random)
  const targetPokemon = route.params?.pokemonName || "Pikachu"; 

  useEffect(() => {
    if (!hasPermission) requestPermission();
    
    // Subscribe to Gyroscope
    const subscription = gyroscope.subscribe(({ x, y }) => {
      setOffset((prev) => ({
        x: prev.x + y * 2, // Tilt affects X
        y: prev.y + x * 2  // Tilt affects Y
      }));
    });

    return () => subscription.unsubscribe();
  }, [hasPermission]);

  const handleCapture = () => {
    Alert.alert("Gotcha!", `${targetPokemon} was caught!`, [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
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

      {/* AR Overlay Layer */}
      <View style={styles.overlay}>
        <Text style={styles.arText}>Scanning for: {targetPokemon}...</Text>
        
        {/* Pokemon Sprite that moves with Gyro */}
        <Image 
          source={{ uri: `https://img.pokemondb.net/sprites/black-white/anim/normal/${targetPokemon.toLowerCase()}.gif` }} 
          style={[
            styles.pokemonSprite, 
            { transform: [{ translateX: offset.x }, { translateY: offset.y }] } 
          ]} 
        />
        
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
  pokemonSprite: { width: 150, height: 150, resizeMode: 'contain' },
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