import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  ImageBackground, // Added ImageBackground
} from 'react-native';

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get('window');

// --- Component for the Search Bar ---
const SearchBar = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    Alert.alert('Search Action', `Searching for: ${searchText}`);
  };

  return (
    // Use the search.png as the background for the search bar
    <ImageBackground
      source={require('./assets/search.png')} 
      style={styles.searchBarBackground}
      resizeMode="stretch"
    >
      <View style={styles.searchBarContent}>
        {/* Placeholder for Search text/input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#FFF"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          onSubmitEditing={handleSearch}
        />
      </View>
    </ImageBackground>
  );
};

// --- Component for the Menu Buttons ---
interface MenuButtonProps {
  text: string;
  onPress: () => void;
  assetSource: any; // The specific button background image
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

// --- Main Pokedex Screen Component ---
const PokedexScreen = () => {
  // Placeholder functions for menu actions
  const goToCommunity = () => Alert.alert('Navigation', 'Go to Community Screen');
  const goToMap = () => Alert.alert('Navigation', 'Go to Map Screen');
  const startScan = () => Alert.alert('Action', 'Starting Scan...');

  return (
    <View style={styles.container}>
      {/* 1. Header with Title and Professor Icon */}
      <View style={styles.header}>
        <Text style={styles.title}>PokéDex</Text>
        <Image
          source={require('./assets/profile.png')} // Keep the small icon
          style={styles.professorIcon}
        />
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar />
      </View>

      {/* 3. Main Content Area */}
      <View style={styles.contentArea}>
        {/* The main area where Pokemon entries would be displayed */}
      </View>

      {/* 4. Menu Buttons and Decorative Image */}
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

        {/* Decorative Oversized Poke Ball */}
        <Image
          source={require('./assets/pokeball-Sheet.png')} // Keep the decorative image
          style={styles.oversizedPokeball}
        />
      </View>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5F4FF', // Light blue background color from image
  },
  
  // --- Header Styles ---
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
  professorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden', // Ensures the icon image fits the circle
  },
  
  // --- Search Bar Styles ---
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  searchBarBackground: {
    width: '100%',
    height: 45, // Match the height of the image asset
    justifyContent: 'center',
    paddingLeft: 55, // Account for the Pokeball on the left of the image asset
    paddingRight: 55, // Account for the fishing lure on the right of the image asset
  },
  searchBarContent: {
    flex: 1,
    justifyContent: 'center',
    // The actual background/border is provided by the ImageBackground
  },
  searchInput: {
    fontSize: 18,
    color: '#FFF', // Text color needs to be visible over the blue background
    fontFamily: 'PixelifySans-Regular',
    padding: 0,
    margin: 0,
    height: '100%',
  },
  
  // --- Content Area Styles ---
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // --- Footer/Menu Styles ---
  footerMenu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  menuButtonsContainer: {
    flex: 1,
    marginBottom: height * 0.05,
    gap: 10, // Space between buttons
  },
  menuButtonBackground: {
    width: 170, // Fixed width that looks good next to the pokeball
    height: 45, // Match the height of the image asset
    justifyContent: 'center',
    paddingLeft: 55, // Account for the Pokeball icon on the left of the image asset
  },
  menuButtonText: {
    fontSize: 18,
    color: '#FFF', // Text color visible over the blue background
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
  },
});

export default PokedexScreen;