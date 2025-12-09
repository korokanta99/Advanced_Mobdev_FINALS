import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';

// --- Assets ---
// MAKE SURE 'pixel-arrow.png' IS IN YOUR assets FOLDER
const PIXEL_BACK_ARROW = require('./assets/back-Sheet.png');

// Other assets (keep these as they were)
const POKEBALL_ICON = require('./assets/pokeball-Sheet.png');
const TRAINER_SPRITE_SMALL = require('./assets/profileimg.png');
const TRAINER_SPRITE_LARGE = require('./assets/profileimg2.png');
const RED_POKEBALL = require('./assets/pokeball-Sheet.png');
const ORANGE_POKEBALL = require('./assets/pokeball-Sheet.png');

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  
  const userProfile = {
    username: 'Carl Buena',
    email: 'Carl@gmail.com',
  };
  const scannedCount = 151;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
             {/*Replaced Text with Image */}
            <Image source={PIXEL_BACK_ARROW} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileContent}>

          {/* Left Side: Info Boxes */}
          <View style={styles.leftColumn}>
            
            {/* Name Box */}
            <View style={styles.retroBox}>
              <Text style={styles.boxText}>{userProfile.username}</Text>
              <View style={styles.accentBar} />
            </View>

            {/* Email Box */}
            <View style={styles.retroBox}>
              <Text style={styles.boxText}>{userProfile.email}</Text>
              <View style={styles.accentBar} />
            </View>

            {/* Scanned Count */}
            <View style={styles.scannedSection}>
              <Text style={styles.scannedLabel}>Scanned#</Text>
              <View style={styles.scannedRow}>
                <Image source={POKEBALL_ICON} style={styles.smallPokeball} />
                <Text style={styles.scannedNumber}>{scannedCount}</Text>
              </View>
            </View>
          </View>

          {/* Sprites (Absolute Positioning) */}
          <Image source={TRAINER_SPRITE_SMALL} style={styles.spriteSmall} />
     
          <Image source={TRAINER_SPRITE_LARGE} style={styles.spriteLarge} />
          <Image source={ORANGE_POKEBALL} style={styles.spriteLargeBall} />

          {/* Action Buttons */}
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.retroButton}>
              <Text style={styles.buttonText}>EDIT</Text>
              <View style={styles.accentBarButton} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.retroButton}>
              <Text style={styles.buttonText}>SIGN OUT</Text>
              <View style={styles.accentBarButton} />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---

const PIXEL_FONT = 'VT323-Regular';
const COLORS = {
  bg: '#A8E6F0',
  boxBg: '#F4B860',
  accent: '#D38C40',
  border: '#2A2A2A',
  white: '#FFFFFF',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    justifyContent: 'center',
    height: 40, 
    width: 40,
  },
  // New style for the image arrow
  backArrowImage: {
    width: 35, 
    height: 35,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 50,
    color: COLORS.white,
    fontFamily: PIXEL_FONT,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  // Main Layout
  profileContent: {
    flex: 1,
    position: 'relative',
    height: 600,
  },
  leftColumn: {
    paddingLeft: 20,
    width: '55%',
    zIndex: 10,
  },

  // Retro Boxes
  retroBox: {
    backgroundColor: COLORS.boxBg,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  boxText: {
    color: COLORS.white,
    fontFamily: PIXEL_FONT,
    fontSize: 22,
    marginBottom: 4,
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS.accent,
    width: '100%',
    borderRadius: 2,
  },

  // Scanned Section
  scannedSection: {
    marginTop: 5,
  },
  scannedLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: 26,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  scannedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  smallPokeball: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  scannedNumber: {
    fontFamily: PIXEL_FONT,
    fontSize: 32,
    color: COLORS.black,
    fontWeight: 'bold',
  },

  // Sprites
  spriteSmall: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 100,
    height: 120,
    resizeMode: 'contain',
  },
  spriteFloatingBall: {
    position: 'absolute',
    top: 180,
    right: 50,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  spriteLarge: {
    position: 'absolute',
    bottom: 0,
    left: -20,
    width: 250,
    height: 250,
    resizeMode: 'contain',
    zIndex: 1,
  },
  spriteLargeBall: {
    position: 'absolute',
    bottom: 0,
    right: -20,
    width: 160,
    height: 160,
    resizeMode: 'contain',
    zIndex: 0,
  },

  // Bottom Buttons
  actionButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    zIndex: 20,
  },
  retroButton: {
    backgroundColor: COLORS.boxBg,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 15,
    paddingVertical: 8,
    width: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: PIXEL_FONT,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accentBarButton: {
    height: 4,
    backgroundColor: COLORS.accent,
    width: '80%',
    borderRadius: 2,
  },
});

export default ProfileScreen;