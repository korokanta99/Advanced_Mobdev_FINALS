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

const { width, height } = Dimensions.get('window');

// Helper to get random coord offset
const getRandomOffset = () => (Math.random() - 0.5) * 0.002; 

const MapScreen = () => {
  // FIX 1: Type the navigation as <any> to stop the 'never' error
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);
  
  // FIX 2: Type the state as <any> so it accepts the object { latitude, longitude }
  const [location, setLocation] = useState<any>(null);
  const [wildPokemon, setWildPokemon] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // 0. ASK FOR PERMISSIONS ON LOAD
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Location permission granted");
          }
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
    
    // Simulate a network scan delay
    setTimeout(() => {
      const { latitude, longitude } = location;
      const newSpawns = [];
      for (let i = 0; i < 3; i++) {
        const id = Math.floor(Math.random() * 151) + 1;
        newSpawns.push({
          id,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          latitude: latitude + getRandomOffset(),
          longitude: longitude + getRandomOffset(),
        });
      }
      setWildPokemon(newSpawns);
      setIsScanning(false);
      
      // Zoom map to the new cluster
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }, 500);
    }, 1000);
  };

  // 2. TRACK USER LOCATION
  const handleUserLocationChange = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    // Ignore invalid 0,0 coordinates
    if (latitude === 0 && longitude === 0) return;

    setLocation({ latitude, longitude });
  };

  // 3. AUTO-SCAN ONCE WHEN LOCATION FIRST FOUND
  useEffect(() => {
    if (location && wildPokemon.length === 0) {
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
          // This navigation call will now work because of the <any> fix above
          onPress: () => navigation.navigate('Scan', { 
            pokemonId: pokemon.id,
            pokemonImage: pokemon.sprite 
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
        followsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={handleUserLocationChange}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Render Wild Pokemon Markers */}
        {wildPokemon.map((poke, index) => (
          <Marker
            key={`${poke.id}-${index}`} 
            coordinate={{ latitude: poke.latitude, longitude: poke.longitude }}
            onPress={() => handleMarkerPress(poke)}
          >
             <View style={styles.markerContainer}>
               <Image source={{ uri: poke.sprite }} style={styles.markerImage} />
             </View>
          </Marker>
        ))}
      </MapView>

      {/* SEARCH AREA BUTTON */}
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
  markerContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  scanButton: {
    position: 'absolute',
    bottom: 100, // Above the exit button
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanText: { 
    fontFamily: 'VT323-Regular', 
    fontSize: 24, 
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 2 
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#D38C40',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    elevation: 5,
  },
  backText: { fontFamily: 'VT323-Regular', fontSize: 24, color: '#FFF' }
});

export default MapScreen;