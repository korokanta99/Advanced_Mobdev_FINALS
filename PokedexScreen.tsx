import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  BackHandler,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { fetchPokemon } from './src/store/pokemonSlice';

const { width, height } = Dimensions.get('window');

// Background Image Asset
const BACKGROUND_IMG = require('./assets/background.png');

// Mock Data for "aj"
// const MOCK_DISCOVERED_IDS = [1, 4, 7, 25, 133, 143, 150];

// 🟢 TYPE ICONS MAPPING (Static requires are necessary in RN)
const TYPE_ICONS: { [key: string]: any } = {
  bug: require('./assets/Type/bug.png'),
  dark: require('./assets/Type/dark.png'),
  dragon: require('./assets/Type/dragon.png'),
  electric: require('./assets/Type/electric.png'),
  fairy: require('./assets/Type/fairy.png'),
  fighting: require('./assets/Type/fighting.png'),
  fire: require('./assets/Type/fire.png'),
  flying: require('./assets/Type/flying.png'),
  ghost: require('./assets/Type/ghost.png'),
  grass: require('./assets/Type/grass.png'),
  ground: require('./assets/Type/ground.png'),
  ice: require('./assets/Type/ice.png'),
  normal: require('./assets/Type/normal.png'),
  poison: require('./assets/Type/poison.png'),
  psychic: require('./assets/Type/psychic.png'),
  rock: require('./assets/Type/rock.png'),
  steel: require('./assets/Type/steel.png'),
  water: require('./assets/Type/water.png'),
};

// --- Components ---

const SearchBar = ({ value, onSearch, onMicPress, isListening }: any) => (
  <View style={styles.searchRow}>
    <ImageBackground source={require('./assets/search.png')} style={styles.searchBarBackground} resizeMode="stretch">
      <TextInput
        style={styles.searchInput}
        placeholder="Search pokemon..."
        placeholderTextColor="#FFF"
        onChangeText={onSearch}
        value={value}
        autoCapitalize="none"
      />
    </ImageBackground>

    <TouchableOpacity onPress={onMicPress} style={styles.micButtonContainer}>
       <Icon
         name={isListening ? "mic" : "mic-none"}
         size={28}
         color={isListening ? "#ff4444" : "#ffffff"}
       />
    </TouchableOpacity>
  </View>
);

const PokemonCard = ({ pokemon, onPress }: { pokemon: any, onPress: () => void }) => {
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default
    || pokemon.sprites?.front_default;

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardContainer}>
        <ImageBackground
          source={require('./assets/inputs-Sheet.png')}
          style={styles.cardBackground}
          resizeMode="stretch"
        >
          <View style={styles.cardContent}>
            <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
            <View style={styles.pokemonInfo}>
              <Text style={styles.pokemonName}>{pokemon.name}</Text>
              <View style={styles.hpBar}>
                <View style={styles.hpFill} />
              </View>
            </View>
            <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(3, '0')}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

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

// 🟢 ENHANCED MODAL: Now with Images for Types
const PokemonDetailModal = ({ visible, pokemon, onClose }: { visible: boolean, pokemon: any, onClose: () => void }) => {
  if (!pokemon) return null;

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;
  const abilities = pokemon.abilities.map((a: any) => a.ability.name.replace('-', ' ')).join(', ').toUpperCase();

  const getStat = (name: string) => {
    const s = pokemon.stats.find((s: any) => s.stat.name === name);
    return s ? s.base_stat : 0;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeaderRow}>
               <Text style={styles.modalTitle}>{pokemon.name}</Text>
               <Text style={styles.modalId}>#{String(pokemon.id).padStart(3, '0')}</Text>
            </View>

            <Image source={{ uri: imageUrl }} style={styles.modalImage} />

            <View style={styles.infoBox}>
                {/* 🟢 REPLACED TEXT TYPES WITH ICONS */}
                <View style={styles.typeRow}>
                  <Text style={styles.infoText}>TYPE: </Text>
                  {pokemon.types.map((t: any, index: number) => (
                    <Image
                      key={index}
                      source={TYPE_ICONS[t.type.name]}
                      style={styles.typeIcon}
                      resizeMode="contain"
                    />
                  ))}
                </View>
                <Text style={styles.infoText}>HT: {pokemon.height / 10}m   WT: {pokemon.weight / 10}kg</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>HP</Text>
                    <Text style={styles.statValue}>{getStat('hp')}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>ATK</Text>
                    <Text style={styles.statValue}>{getStat('attack')}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>DEF</Text>
                    <Text style={styles.statValue}>{getStat('defense')}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>SPD</Text>
                    <Text style={styles.statValue}>{getStat('speed')}</Text>
                </View>
            </View>

            <View style={styles.abilityBox}>
                <Text style={styles.abilityTitle}>ABILITIES:</Text>
                <Text style={styles.abilityText}>{abilities}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- Main Screen ---
const PokedexScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { list, isLoading } = useSelector((state: any) => state.pokemon);
  const { profile, caughtPokemonIds } = useSelector((state: any) => state.user);

  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Modal State
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Gender Logic
  const gender = profile?.gender || '';
  const isFemale = gender.toLowerCase() === 'female';
  const profileIcon = isFemale
    ? require('./assets/profileM.png')
    : require('./assets/profile.png');

  // MOCK VOICE SEARCH LOGIC
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    setIsListening(true);
    setSearchText("");
    setTimeout(() => {
      const demoWords = ["Pikachu", "Charizard", "Bulbasaur", "Mewtwo", "Eevee"];
      const randomWord = demoWords[Math.floor(Math.random() * demoWords.length)];
      setSearchText(randomWord);
      setIsListening(false);
    }, 1500);
  };

  // Hardware Back Button
  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [modalVisible]);

  // Fetch Data
  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchPokemon());
    }
  }, [dispatch, list]);

  // Filter Logic
// Filter Logic
  useEffect(() => {
    if (list.length > 0) {
      // ✅ USE REAL REDUX DATA HERE
      const caughtPokemon = list.filter((p: any) =>
        caughtPokemonIds.includes(p.id)
      );
      const filtered = caughtPokemon.filter((p: any) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setDisplayedPokemon(filtered);
    }
  }, [list, searchText, caughtPokemonIds]); // Add caughtPokemonIds to dependency array

  const handlePokemonPress = (pokemon: any) => {
    setSelectedPokemon(pokemon);
    setModalVisible(true);
  };

  const goToCommunity = () => navigation.navigate('Community');
  const goToMap = () => navigation.navigate('Map');

  return (
    <ImageBackground source={BACKGROUND_IMG} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PokéDex</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={profileIcon}
              style={styles.professorIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <SearchBar
              value={searchText}
              onSearch={setSearchText}
              onMicPress={startVoiceSearch}
              isListening={isListening}
          />
        </View>

        <View style={styles.contentArea}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={displayedPokemon}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }) => (
                <PokemonCard
                  pokemon={item}
                  onPress={() => handlePokemonPress(item)}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No Pokémon caught yet!</Text>
              }
              contentContainerStyle={{ paddingBottom: 280 }}
            />
          )}
        </View>

        <PokemonDetailModal
          visible={modalVisible}
          pokemon={selectedPokemon}
          onClose={() => setModalVisible(false)}
        />

        <View style={styles.footerMenu}>
          <View style={styles.menuButtonsContainer}>
            <MenuButton text="Community" onPress={goToCommunity} assetSource={require('./assets/finalcom.png')} />
            <MenuButton text="Map" onPress={goToMap} assetSource={require('./assets/map.png')} />
          </View>
          <Image source={require('./assets/pokeball-Sheet.png')} style={styles.oversizedPokeball} />
        </View>
      </View>
    </ImageBackground>
  );
};

const PIXEL_FONT = 'VT323-Regular';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  professorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },

  // SEARCH ROW STYLES
  searchSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBarBackground: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    paddingLeft: 50,
    marginRight: 10,
  },
  searchInput: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'PixelifySans-Regular',
    padding: 0,
    margin: 0,
    height: '100%',
  },
  micButtonContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#D38C40',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // CARD STYLES
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    width: '85%',
    height: 180,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    zIndex: 11,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  pokemonInfo: {
    alignItems: 'center',
    width: '100%',
  },
  pokemonName: {
    fontSize: 32,
    color: '#FFF',
    fontFamily: 'PixelifySans-Bold',
    textTransform: 'capitalize',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 1,
  },
  hpBar: {
    width: '70%',
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  hpFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4ade80',
  },
  pokemonId: {
    position: 'absolute',
    top: 10,
    right: 15,
    fontSize: 20,
    color: '#EEE',
    fontFamily: 'PixelifySans-Bold',
    opacity: 0.8,
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
    height: height * 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    pointerEvents: 'box-none',
  },
  menuButtonsContainer: {
    flex: 1,
    marginBottom: 20,
    gap: 12,
    zIndex: 10,
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
    right: -30,
    bottom: -70,
    width: 170,
    height: width * 0.65,
    resizeMode: 'contain',
    zIndex: 10,
    opacity: 0.9,
  },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#F4B860',
    borderWidth: 4,
    borderColor: '#2A2A2A',
    borderRadius: 8,
    padding: 4,
  },
  modalContent: {
    backgroundColor: '#A8E6F0',
    borderWidth: 2,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    padding: 15,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalTitle: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 32,
    color: '#000',
    textTransform: 'capitalize',
  },
  modalId: {
    fontFamily: PIXEL_FONT,
    fontSize: 24,
    color: '#333',
  },
  modalImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 8,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    marginBottom: 10,
    alignItems: 'center',
  },
  // 🟢 NEW TYPE ICONS LAYOUT
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  typeIcon: {
    width: 50,
    height: 25,
    marginHorizontal: 4,
  },
  infoText: {
    fontFamily: PIXEL_FONT,
    fontSize: 20,
    color: '#000',
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#2A2A2A',
    padding: 8,
    marginBottom: 10,
  },
  statRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  statValue: {
    fontFamily: PIXEL_FONT,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  abilityBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#2A2A2A',
    padding: 8,
    marginBottom: 15,
  },
  abilityTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  abilityText: {
    fontFamily: PIXEL_FONT,
    fontSize: 20,
    color: '#000',
    textTransform: 'capitalize',
  },
  closeButton: {
    backgroundColor: '#D38C40',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    borderRadius: 4,
  },
  closeButtonText: {
    fontFamily: PIXEL_FONT,
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default PokedexScreen;