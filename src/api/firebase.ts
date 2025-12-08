// src/api/firebase.ts

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Creates a new user in Auth AND saves their profile to Firestore.
 */
export async function signupWithEmail(email, password, username, gender) {
    try {
        // 1. Create the secure account (Authentication)
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Prepare the data
        const userProfile = {
            uid: user.uid,
            email: user.email,
            username: username || "Trainer",
            gender: gender || "Not Specified",
            discovered: [],
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        // 3. Write to Firestore Database (This is the step that was missing!)
        await firestore().collection('users').doc(user.uid).set(userProfile);

        return userProfile;
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
}

/**
 * Logs the user in and retrieves their profile from Firestore.
 */
export async function loginWithEmail(email, password) {
    try {
        // 1. Login
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // 2. Fetch Profile from Database
        const userDoc = await firestore().collection('users').doc(uid).get();

        if (!userDoc.exists) {
            // Optional: Auto-create profile if missing (fallback)
            throw new Error("User profile not found in database.");
        }

        return userDoc.data();
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}