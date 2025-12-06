// src/api/firebase.ts

import auth from '@react-native-firebase/auth';
// ⚠️ IMPORTANT: Import 'firestore' instead of 'database'
import firestore from '@react-native-firebase/firestore';

// ----------------------------------------------------------------------
// 1. Private Utility: Saves the complete profile to Firestore
//    (Used during signup to store username and initialize the discovered list)
// ----------------------------------------------------------------------
async function saveUserProfile(uid: string, email: string, username: string) {
    // 🔥 New Firestore syntax: Reference the 'users' collection and a document by UID
    const userDocRef = firestore().collection('users').doc(uid);

    const profileData = {
        uid: uid,
        email: email,
        username: username, // Stored for display purposes
        discovered: [],
        createdAt: firestore.FieldValue.serverTimestamp(), // Firestore way to get server time
    };

    // Use .set() to create the document
    await userDocRef.set(profileData);
    return profileData;
}


// ----------------------------------------------------------------------
// 2. Private Utility: Fetches the complete profile from Firestore
//    (Used after both login and signup to get the username and discovered list)
// ----------------------------------------------------------------------
async function fetchUserProfile(uid: string) {
    // 🔥 New Firestore syntax: Get the document
    const snapshot = await firestore().collection('users').doc(uid).get();

    if (snapshot.exists) {
        // .data() returns the document fields
        return snapshot.data();
    } else {
        throw new Error("User profile not found in database.");
    }
}


// ----------------------------------------------------------------------
// 3. Exported Function: Handles SIGNUP
// ----------------------------------------------------------------------
export async function signupWithEmail(email: string, password: string, username: string) {
    try {
        // ... (Auth logic remains the same)
        const response = await auth().createUserWithEmailAndPassword(email, password);
        const uid = response.user.uid;

        // STEP 2: Save the full profile using the new Firestore function
        const profile = await saveUserProfile(uid, email, username);

        return profile;
    } catch (error) {
        console.error("Firebase Signup Error:", error);
        throw new Error('Signup failed. Email may already be in use.');
    }
}


// ----------------------------------------------------------------------
// 4. Exported Function: Handles LOGIN
// ----------------------------------------------------------------------
export async function loginWithEmail(email: string, password: string) {
    try {
        // ... (Auth logic remains the same)
        const response = await auth().signInWithEmailAndPassword(email, password);
        const uid = response.user.uid;

        // STEP 2: Fetch the custom user profile data using the new Firestore function
        const profile = await fetchUserProfile(uid);

        return profile;
    } catch (error) {
        console.error("Firebase Login Error:", error);
        throw new Error('Authentication failed. Check your email and password.');
    }
}