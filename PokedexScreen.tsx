import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  ImageBackground,
  BackHandler, // 1. Import BackHandler
  FlatList,    // 2. Import FlatList for the grid
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPokemon } from './src/store/pokemonSlice'; // Ensure this path is correct

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// --- Mock Data for User "aj" ---
// Since your DB has an empty array, we mock these IDs as "caught"
const MOCK_DISCOVERED_IDS = [1, 4, 7, 25]; // Bulbasaur, Charmander, Squirtle, Pikachu

// --- Component for the Search Bar ---
const SearchBar = ({ onSearch }: { onSearch: (text: string) => void }) => {
  return (
    <ImageBackground
      source={require('./assets/search.png')}
      style={styles.searchBarBackground}
      resizeMode="stretch"
    >
      <View style={styles.searchBarContent}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search captured..."
          placeholderTextColor="#FFF"
          onChangeText={onSearch}
          autoCapitalize="none"
        />
      </View>
    </ImageBackground>
  );
};

// --- Component for a Single Pokemon Card ---
const PokemonCard = ({ pokemon }: { pokemon: any }) => {
  // Use the official artwork if available, otherwise fallback
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default
    || pokemon.sprites?.front_default;

  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={require('./assets/inputs-Sheet.png')} // Reusing the input background for cards
        style={styles.cardBackground}
        resizeMode="stretch"
      >
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
        <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(3, '0')}</Text>
      </ImageBackground>
    </View>
  );
};

// --- Menu Button Component ---
interface MenuButtonProps {
  text: string;
  onPress: () => void;
  assetSource: any;
}

const MenuButton: React.FC<MenuButtonProps> = ({ text, onPress, assetSource }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <ImageBackground
      source={assetSource}
      style={styles.menuButtonBackground}
      resizeMode="stretch"
    >
      <Text style={styles.menuButtonText}>{text}</Text>
    </ImageBackground>
  </TouchableOpacity>
);

// --- Main Screen ---
const PokedexScreen = () => {
  const dispatch = useDispatch();

  // Redux State
  const { list, isLoading } = useSelector((state: any) => state.pokemon);
  const { profile } = useSelector((state: any) => state.user);

  // Local State
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [searchText, setSearchText] = useState('');

  // 1. Handle Hardware Back Button (Exit App)
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // 2. Fetch Data on Mount
  useEffect(() => {
    // Dispatch the thunk to get the full list of 151 Pokemon
    if (list.length === 0) {
      dispatch(fetchPokemon());
    }
  }, [dispatch, list]);

  // 3. Filter Logic (Mock Data + Search)
  useEffect(() => {
    if (list.length > 0) {
      // Use the MOCK IDs instead of profile.discovered for this demo
      const caughtPokemon = list.filter((p: any) =>
        MOCK_DISCOVERED_IDS.includes(p.id)
      );

      // Apply Search Filter
      const filtered = caughtPokemon.filter((p: any) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );

      setDisplayedPokemon(filtered);
    }
  }, [list, searchText, profile]); // Re-run when list or search changes

  // Menu Actions
  const goToCommunity = () => Alert.alert('Navigation', 'Go to Community Screen');
  const goToMap = () => Alert.alert('Navigation', 'Go to Map Screen');
  const startScan = () => Alert.alert('Action', 'Starting Scan...');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PokéDex</Text>
        <Image
          source={require('./assets/profile.png')}
          style={styles.professorIcon}
        />
      </View>

      {/* User Greeting (Optional debugging helper) */}
      <Text style={styles.greeting}>
        Trainer: {profile?.username || 'aj'} (ID: {profile?.uid?.substring(0,5)}...)
      </Text>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar onSearch={setSearchText} />
      </View>

      {/* Main Content: The Grid of Pokemon */}
      <View style={styles.contentArea}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={displayedPokemon}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }) => <PokemonCard pokemon={item} />}
            numColumns={2} // Grid layout
            columnWrapperStyle={styles.row} // Style for grid rows
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Pokémon caught yet!</Text>
            }
            contentContainerStyle={{ paddingBottom: 150 }} // Space for footer
          />
        )}
      </View>

      {/* Footer Menu */}
      <View style={styles.footerMenu}>
        <View style={styles.menuButtonsContainer}>
          <MenuButton
            text="Community"
            onPress={goToCommunity}
            assetSource={require('./assets/finalcom.png')}
          />
          <MenuButton
            text="Map"
            onPress={goToMap}
            assetSource={require('./assets/map.png')}
          />
          <MenuButton
            text="Scan"
            onPress={startScan}
            assetSource={require('./assets/scanfinal.png')}
          />
        </View>

        <Image
          source={require('./assets/pokeball-Sheet.png')}
          style={styles.oversizedPokeball}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5F4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    color: '#000',
    fontFamily: 'PixelifySans-Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  greeting: {
    textAlign: 'center',
    fontFamily: 'PixelifySans-Regular',
    color: '#333',
    marginBottom: 5,
  },
  professorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  searchBarBackground: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    paddingLeft: 55,
    paddingRight: 55,
  },
  searchBarContent: {
    flex: 1,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'PixelifySans-Regular',
    padding: 0,
    margin: 0,
    height: '100%',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardContainer: {
    width: '48%', // Fits 2 per row
    aspectRatio: 0.8, // Taller than wide
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'PixelifySans-Bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  pokemonId: {
    fontSize: 14,
    color: '#EEE',
    fontFamily: 'PixelifySans-Regular',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'PixelifySans-Regular',
    marginTop: 50,
    color: '#555',
  },
  footerMenu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    pointerEvents: 'box-none', // Allows clicking through empty space
  },
  menuButtonsContainer: {
    flex: 1,
    marginBottom: height * 0.05,
    gap: 10,
  },
  menuButtonBackground: {
    width: 170,
    height: 45,
    justifyContent: 'center',
    paddingLeft: 55,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'PixelifySans-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  oversizedPokeball: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: width * 0.45,
    height: width * 0.45,
    resizeMode: 'contain',
    zIndex: -1, // Behind buttons
  },
});

export default PokedexScreen;