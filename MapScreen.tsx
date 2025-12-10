import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

// Mock Pokemon Data for the map
const WILD_POKEMON = [
  { id: 1, name: 'Bulbasaur', latitudeOffset: 0.001, longitudeOffset: 0.001, icon: require('../../assets/pokeball-Sheet.png') },
  { id: 4, name: 'Charmander', latitudeOffset: -0.002, longitudeOffset: 0.001, icon: require('../../assets/pokeball-Sheet.png') },
  { id: 7, name: 'Squirtle', latitudeOffset: 0.0015, longitudeOffset: -0.002, icon: require('../../assets/pokeball-Sheet.png') },
];

const MapScreen = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default (SF) - will update with real location
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const handleMarkerPress = (pokemonName: string) => {
    Alert.alert("Wild Pokémon Appeared!", `You found a ${pokemonName}! Go to Scan mode to capture it?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Capture", onPress: () => navigation.navigate('Scan', { pokemonName }) }
    ]);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        region={region}
        onUserLocationChange={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setRegion((prev) => ({ ...prev, latitude, longitude }));
        }}
      >
        {/* Spawn Wild Pokemon relative to user location (Simulated) */}
        {WILD_POKEMON.map((poke) => (
          <Marker
            key={poke.id}
            coordinate={{
              latitude: region.latitude + poke.latitudeOffset,
              longitude: region.longitude + poke.longitudeOffset
            }}
            title={`Wild ${poke.name}`}
            onCalloutPress={() => handleMarkerPress(poke.name)}
          >
             <Image source={poke.icon} style={{ width: 40, height: 40 }} resizeMode="contain" />
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>BACK TO DEX</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#D38C40',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2A2A2A'
  },
  backText: { fontFamily: 'VT323-Regular', fontSize: 24, color: '#FFF' }
});

export default MapScreen;