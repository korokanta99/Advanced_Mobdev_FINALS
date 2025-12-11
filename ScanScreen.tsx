import React, { useEffect, useState } from 'react';
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

  // Extract the full 'pokemon' object passed from MapScreen
  // Fallback to "Pikachu" if nothing was passed
  const { pokemon } = route.params || {};
  const targetName = pokemon?.name || "Pikachu";

  useEffect(() => {
    if (!hasPermission) requestPermission();

    // Subscribe to Gyroscope
    const subscription = gyroscope.subscribe(({ x, y }) => {
      setOffset((prev) => ({
        x: prev.x + y * 5,
        y: prev.y + x * 5
      }));
    });

    return () => subscription.unsubscribe();
  }, [hasPermission]);

  const handleCapture = () => {
    // TODO: Add logic here to save 'targetName' to Redux/Global state
    Alert.alert("Gotcha!", `${targetName.toUpperCase()} was caught!`, [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  if (!device || !hasPermission) return <ActivityIndicator size="large" color="#000" style={styles.loading} />;

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
        {/* Retro Header Banner */}
        <View style={styles.headerBanner}>
            <Text style={styles.arText}>SCANNING: {targetName.toUpperCase()}</Text>
        </View>

        {/* DYNAMIC SPRITE */}
        <Image
          source={{ uri: `https://img.pokemondb.net/sprites/black-white/anim/normal/${targetName.toLowerCase()}.gif` }}
          style={[
            styles.pokemonSprite,
            { transform: [{ translateX: offset.x }, { translateY: offset.y }] }
          ]}
        />

        {/* Capture Button */}
        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
           <View style={styles.captureInner} />
           <View style={styles.captureLine} />
        </TouchableOpacity>

        {/* 🟢 MOVED & RENAMED: "RUN" Button at Bottom-Left */}
        <TouchableOpacity style={styles.runBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>RUN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerBanner: {
    position: 'absolute',
    top: 60,
    // 🟢 ADDED: Ensure it doesn't hit the new button position
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  arText: {
    color: '#4ade80',
    fontFamily: 'VT323-Regular',
    fontSize: 32,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 4
  },

  pokemonSprite: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },

  captureBtn: {
    position: 'absolute',
    bottom: 60,
    right: 60,
    // Center horizontally
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff4444',
    borderWidth: 3,
    borderColor: '#2A2A2A'
  },
  captureLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#2A2A2A',
    top: 43
  },

  // 🟢 UPDATED: RUN Button Styles & Position
  runBtn: {
    position: 'absolute',
    bottom: 75, // Aligned with capture button height
    left: 30,   // Placed on the left
    backgroundColor: '#D38C40',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 20,
  },
  btnText: {
    color: '#FFF',
    fontFamily: 'VT323-Regular',
    fontSize: 24, // Slightly larger font
    textShadowColor: 'black',
    textShadowRadius: 1
  }
});

export default ScanScreen;