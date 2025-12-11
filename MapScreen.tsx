import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

// --- Assets ---
const BACK_ARROW = require('./assets/back-Sheet.png');

// Mock Pokemon Data
const WILD_POKEMON = [
  { id: 1, name: 'Bulbasaur', latitudeOffset: 0.001, longitudeOffset: 0.001, icon: require('./assets/pokeball-Sheet.png') },
  { id: 4, name: 'Charmander', latitudeOffset: -0.002, longitudeOffset: 0.001, icon: require('./assets/pokeball-Sheet.png') },
  { id: 7, name: 'Squirtle', latitudeOffset: 0.0015, longitudeOffset: -0.002, icon: require('./assets/pokeball-Sheet.png') },
];

const MapScreen = () => {
  const navigation = useNavigation();

  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const handleMarkerPress = (e: any, pokemon: any) => {
    // Stop event from bubbling to the map (prevents deselection)
    e.stopPropagation();
    setSelectedPokemon(pokemon);
  };

  const handleScanPress = () => {
    if (selectedPokemon) {
      navigation.navigate('Scan', { pokemon: selectedPokemon });
    } else {
      Alert.alert("No Target", "Tap a Pokémon on the map to lock on!");
    }
  };

  const isButtonActive = selectedPokemon !== null;
  const buttonStyle = isButtonActive ? styles.scanButtonActive : styles.scanButtonDisabled;
  const buttonTextStyle = isButtonActive ? styles.scanTextActive : styles.scanTextDisabled;

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={BACK_ARROW} style={styles.backArrow} />
      </TouchableOpacity>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        region={region}
        onUserLocationChange={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setRegion((prev) => ({ ...prev, latitude, longitude }));
        }}
        // Deselect if tapping the empty map background
        onPress={() => setSelectedPokemon(null)}
      >
        {WILD_POKEMON.map((poke) => (
          <Marker
            key={poke.id}
            coordinate={{
              latitude: region.latitude + poke.latitudeOffset,
              longitude: region.longitude + poke.longitudeOffset
            }}
            // 🟢 REMOVED 'title' prop to prevent default callout popup
            onPress={(e) => handleMarkerPress(e, poke)}
          >
             {/* 🟢 ADDED pointerEvents="none" so the Marker receives the touch, not the Image */}
             <Image
               source={poke.icon}
               style={[
                 styles.markerImage,
                 selectedPokemon?.id === poke.id && { transform: [{ scale: 1.3 }] }
               ]}
               resizeMode="contain"
               pointerEvents="none"
             />
          </Marker>
        ))}
      </MapView>

      <View style={styles.footerContainer}>
        <View style={styles.statusBox}>
            <Text style={styles.statusText}>
                {selectedPokemon ? `TARGET: ${selectedPokemon.name.toUpperCase()}` : "SEARCHING..."}
            </Text>
        </View>

        <TouchableOpacity
            style={[styles.scanButtonBase, buttonStyle]}
            onPress={handleScanPress}
            activeOpacity={isButtonActive ? 0.8 : 1}
            disabled={!isButtonActive}
        >
            <Text style={[styles.scanButtonText, buttonTextStyle]}>
                {isButtonActive ? "INITIATE SCAN" : "NO TARGET"}
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PIXEL_FONT = 'VT323-Regular';

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    padding: 5,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  backArrow: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  markerImage: {
    width: 50, // Slightly bigger to make tapping easier
    height: 50,
  },

  footerContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  statusBox: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusText: {
    color: '#4ade80',
    fontFamily: PIXEL_FONT,
    fontSize: 20,
    letterSpacing: 2,
  },

  scanButtonBase: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#2A2A2A',
    elevation: 5,
  },

  scanButtonDisabled: {
    backgroundColor: '#7f8c8d',
    borderColor: '#555',
  },
  scanTextDisabled: {
    color: '#bdc3c7',
  },

  scanButtonActive: {
    backgroundColor: '#F4B860',
    borderColor: '#2A2A2A',
  },
  scanTextActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  scanButtonText: {
    fontFamily: PIXEL_FONT,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default MapScreen;