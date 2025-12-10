import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, setPosts } from './src/store/feedSlice';
import { subscribeToFeed } from './src/api/firebase';

// Assets
const PIXEL_BACK_ARROW = require('./assets/back-Sheet.png');
const MALE_ICON = require('./assets/profile.png');
const FEMALE_ICON = require('./assets/profileM.png');

const CommunityScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state: any) => state.feed);
  const { profile } = useSelector((state: any) => state.user);

  // Ref to auto-scroll to bottom
  const flatListRef = useRef<FlatList>(null);

  const [inputText, setInputText] = useState('');

  // Real-time Listener
  useEffect(() => {
    const unsubscribe = subscribeToFeed((newPosts) => {
      dispatch(setPosts(newPosts));
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handlePost = () => {
    if (inputText.trim() === '') return;

    if (profile) {
      // 🟢 PASS GENDER HERE
      // @ts-ignore
      dispatch(addPost({
        uid: profile.uid,
        username: profile.username || 'Trainer',
        content: inputText,
        gender: profile.gender || 'male'
      }));
      setInputText('');
    }
  };

  const renderPost = ({ item }: { item: any }) => {
    // 🟢 CHECK POST GENDER
    const isPostFemale = item.gender && item.gender.toLowerCase() === 'female';
    const avatarSource = isPostFemale ? FEMALE_ICON : MALE_ICON;

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {/* Use dynamic source */}
          <Image source={avatarSource} style={styles.avatar} />
          <View>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.timestamp}>
                  {new Date(item.createdAt).toLocaleDateString()}
              </Text>
          </View>
        </View>
        <View style={styles.bubble}>
          <Text style={styles.postContent}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Image source={PIXEL_BACK_ARROW} style={styles.backArrowImage} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
      </View>

      <FlatList
        ref={flatListRef}
        // 🟢 REVERSE THE LIST: Oldest Top, Newest Bottom
        data={[...posts].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        // Auto-scroll to bottom when new items appear
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Write a message..."
                placeholderTextColor="#666"
                value={inputText}
                onChangeText={setInputText}
                multiline
            />
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                <Text style={styles.postButtonText}>SEND</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const COLORS = {
    bg: '#C5F4FF',
    box: '#fff',
    accent: '#D38C40',
    text: '#000',
    white: '#FFF',
    inputBg: '#FFF'
};
const PIXEL_FONT = 'VT323-Regular';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#A8E6F0',
    borderBottomWidth: 2,
    borderBottomColor: '#2A2A2A',
  },
  backButton: { marginRight: 15 },
  backArrowImage: { width: 35, height: 35, resizeMode: 'contain' },
  headerTitle: { fontSize: 40, fontFamily: PIXEL_FONT, color: COLORS.white, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 1 },

  listContent: { padding: 20, paddingBottom: 20 },

  postContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  avatar: { width: 30, height: 30, marginRight: 10, borderWidth: 1, borderColor: '#000', borderRadius: 15, backgroundColor: '#FFF' },
  username: { fontFamily: PIXEL_FONT, fontSize: 22, fontWeight: 'bold', color: '#D38C40' },
  timestamp: { fontFamily: PIXEL_FONT, fontSize: 16, color: '#666' },
  bubble: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  postContent: { fontFamily: PIXEL_FONT, fontSize: 20, color: '#333' },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F4B860',
    borderTopWidth: 2,
    borderTopColor: '#2A2A2A',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontFamily: PIXEL_FONT,
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    height: 50,
    color: '#000'
  },
  postButton: {
    marginLeft: 10,
    backgroundColor: '#D38C40',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  postButtonText: { fontFamily: PIXEL_FONT, fontSize: 20, color: '#FFF', fontWeight: 'bold' }
});

export default CommunityScreen;