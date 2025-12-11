import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  PermissionsAndroid, 
  Platform,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addWildSpawns } from './src/store/pokemonSlice';

const { width, height } = Dimensions.get('window');

// Helper to get random coord offset
const getRandomOffset = () => (Math.random() - 0.5) * 0.0005;

const MapScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  
  // Read wild spawns from Redux
  const { wildSpawns } = useSelector((state: any) => state.pokemon);
  
  const [location, setLocation] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // ✅ CALCULATE STARTING REGION
  // If we have pokemon, start map THERE. If not, default to California.
  const initialRegion = wildSpawns.length > 0 
    ? {
        latitude: wildSpawns[0].latitude,
        longitude: wildSpawns[0].longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : {
        latitude: 37.78825, 
        longitude: -122.4324,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

  // 0. ASK FOR PERMISSIONS
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
  }, []);

  // 1. GENERATE POKEMON FUNCTION
  const scanForPokemon = () => {
    if (!location) {
      Alert.alert("Wait", "Finding your location...");
      return;
    }

    setIsScanning(true);
    
    setTimeout(() => {
      const { latitude, longitude } = location;
      const newSpawns = [];
      for (let i = 0; i < 3; i++) {
        const id = Math.floor(Math.random() * 151) + 1;
        newSpawns.push({
          id,
          uniqueKey: `${id}-${Date.now()}-${i}`,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          latitude: latitude + getRandomOffset(),
          longitude: longitude + getRandomOffset(),
        });
      }
      
      dispatch(addWildSpawns(newSpawns));
      setIsScanning(false);
      
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }, 500);
    }, 1000);
  };

  // 2. TRACK USER LOCATION
  const handleUserLocationChange = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (latitude === 0 && longitude === 0) return;
    setLocation({ latitude, longitude });
  };

  // 3. AUTO-SCAN (Only if list is totally empty)
  useEffect(() => {
    if (location && wildSpawns.length === 0) {
      scanForPokemon();
    }
  }, [location]);

  const handleMarkerPress = (pokemon: any) => {
      Alert.alert(
        "Wild Pokémon Appeared!", 
        "Do you want to capture it?", 
        [
          { text: "Run Away", style: "cancel" },
          { 
            text: "Open Camera", 
            onPress: () => navigation.navigate('Scan', { 
              pokemonId: pokemon.id,
              pokemonImage: pokemon.sprite,
              // 👇 NEW: Pass the unique ID so we can delete it later
              instanceId: pokemon.uniqueKey 
            }) 
          }
        ]
      );
    };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true} // Keep map centered on user
        showsMyLocationButton={true}
        onUserLocationChange={handleUserLocationChange}
        initialRegion={initialRegion} // ✅ Use the dynamic start point
      >
        {wildSpawns.map((poke: any) => (
          <Marker
            key={poke.uniqueKey} 
            coordinate={{ latitude: poke.latitude, longitude: poke.longitude }}
            onPress={() => handleMarkerPress(poke)}
          >
             <View style={styles.markerContainer}>
               <Image source={{ uri: poke.sprite }} style={styles.markerImage} />
             </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity 
        style={styles.scanButton} 
        onPress={scanForPokemon}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.scanText}>SCAN AREA</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>EXIT MAP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  markerContainer: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  markerImage: { width: 60, height: 60, resizeMode: 'contain' },
  scanButton: {
    position: 'absolute', bottom: 100, alignSelf: 'center',
    backgroundColor: '#3b82f6', paddingHorizontal: 30, paddingVertical: 12,
    borderRadius: 25, borderWidth: 2, borderColor: '#FFF', elevation: 5,
  },
  scanText: { fontFamily: 'VT323-Regular', fontSize: 24, color: '#FFF', fontWeight: 'bold' },
  backButton: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    backgroundColor: '#D38C40', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 8, borderWidth: 2, borderColor: '#2A2A2A', elevation: 5,
  },
  backText: { fontFamily: 'VT323-Regular', fontSize: 24, color: '#FFF' }
});

export default MapScreen;