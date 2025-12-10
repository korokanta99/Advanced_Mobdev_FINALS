import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, updateProfile } from './src/store/userSlice';

// --- Assets ---
const PIXEL_BACK_ARROW = require('./assets/back-Sheet.png');
const POKEBALL_ICON = require('./assets/pokeball-Sheet.png');
const ORANGE_POKEBALL = require('./assets/pokeball-Sheet.png');

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: any) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [email, setEmail] = useState(profile?.email || '');

  // 🟢 DETERMINE GENDER & SELECT SPRITES
  const gender = profile?.gender || '';
  const isFemale = gender.toLowerCase() === 'female';

  const smallSprite = isFemale
    ? require('./assets/profileimgM.png')
    : require('./assets/profileimg.png');

  const largeSprite = isFemale
    ? require('./assets/profileimgM2.png')
    : require('./assets/profileimg2.png');

  const scannedCount = profile?.discovered ? profile.discovered.length : 0;

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
            text: "Log Out",
            style: "destructive",
            onPress: async () => {
                // 1. Clear Data
                // @ts-ignore
                await dispatch(logoutUser());

                // 2. Force Navigation to Login
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        }
    ]);
  };

  const toggleEdit = () => {
    if (isEditing) {
        if (profile && profile.uid) {
            if (username !== profile.username || email !== profile.email) {
                // @ts-ignore
                dispatch(updateProfile({
                    uid: profile.uid,
                    data: { username, email }
                }));
                Alert.alert("Success", "Profile updated successfully!");
            }
        }
    }
    setIsEditing(!isEditing);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header - Goes to Pokedex */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Image source={PIXEL_BACK_ARROW} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileContent}>
          <View style={styles.leftColumn}>
            <View style={styles.retroBox}>
              {isEditing ? (
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={styles.editInput}
                    autoCapitalize="none"
                  />
              ) : (
                  <Text style={styles.boxText}>{username || 'Trainer'}</Text>
              )}
              <View style={styles.accentBar} />
            </View>

            <View style={styles.retroBox}>
               {isEditing ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.editInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
              ) : (
                  <Text style={styles.boxText}>{email || 'No Email'}</Text>
              )}
              <View style={styles.accentBar} />
            </View>

            <View style={styles.scannedSection}>
              <Text style={styles.scannedLabel}>Scanned#</Text>
              <View style={styles.scannedRow}>
                <Image source={POKEBALL_ICON} style={styles.smallPokeball} />
                <Text style={styles.scannedNumber}>{scannedCount}</Text>
              </View>
            </View>
          </View>

          {/* 🟢 DYNAMIC SPRITES */}
          <Image source={smallSprite} style={styles.spriteSmall} />
          <Image source={largeSprite} style={styles.spriteLarge} />
          <Image source={ORANGE_POKEBALL} style={styles.spriteLargeBall} />

          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.retroButton} onPress={toggleEdit}>
              <Text style={styles.buttonText}>{isEditing ? "SAVE" : "EDIT"}</Text>
              <View style={styles.accentBarButton} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.retroButton} onPress={handleSignOut}>
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
  editBg: 'rgba(0,0,0,0.1)'
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
  editInput: {
    color: COLORS.white,
    fontFamily: PIXEL_FONT,
    fontSize: 22,
    marginBottom: 4,
    backgroundColor: COLORS.editBg,
    paddingHorizontal: 5,
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS.accent,
    width: '100%',
    borderRadius: 2,
  },
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
  spriteSmall: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 100,
    height: 120,
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