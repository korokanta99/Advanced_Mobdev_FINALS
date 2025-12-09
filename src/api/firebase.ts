// src/api/firebase.ts

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Creates a new user in Auth AND saves their profile to Firestore.
 */
export async function signupWithEmail(email, password, username, gender) {
    try {
        // 1. Create the secure account
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Prepare the base profile data
        const baseProfile = {
            uid: user.uid,
            email: user.email,
            username: username || "Trainer",
            gender: gender || "Not Specified",
            discovered: [],
        };

        // 3. Write to Firestore (Use Server Timestamp for accuracy)
        await firestore().collection('users').doc(user.uid).set({
            ...baseProfile,
            createdAt: firestore.FieldValue.serverTimestamp(), // 👈 Database gets the complex object
        });

        // 4. Return to Redux (Use simple String to prevent crash)
        return {
            ...baseProfile,
            createdAt: new Date().toISOString(), // 👈 Redux gets a simple string
        };

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
            throw new Error("User profile not found in database.");
        }

        const userData = userDoc.data();

        // 🛑 CRITICAL FIX: Convert Firestore Timestamp to String before returning
        return {
            ...userData,
            createdAt: userData.createdAt && userData.createdAt.toDate
                ? userData.createdAt.toDate().toISOString() // Convert Timestamp to String
                : new Date().toISOString() // Fallback
        };

    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}