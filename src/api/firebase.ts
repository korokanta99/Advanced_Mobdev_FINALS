// src/api/firebase.ts

import auth from '@react-native-firebase/auth';
// You will need to install this package for database access
import database from '@react-native-firebase/database';

// --- Existing loginWithEmail function is fine as is ---

/**
 * Saves a new user profile to the Firebase Realtime Database.
 */
async function saveUserProfile(uid: string, email: string, username: string) {
    // Reference to the 'users' collection with the user's UID as the key
    const userRef = database().ref(`/users/${uid}`);

    // Data structure for the user profile
    const profileData = {
        uid: uid,
        email: email,
        username: username,
        discovered: [], // Initialize discovered list
        createdAt: database.ServerValue.TIMESTAMP, // Helpful for sorting
    };

    // Set the data in the database
    await userRef.set(profileData);

    return profileData;
}


/**
 * Handles user sign-up with email, password, AND username.
 * @param email
 * @param password
 * @param username
 * @returns A comprehensive user object including the username.
 */
export async function signupWithEmail(email: string, password: string, username: string) {
    try {
        // STEP 1: Create the user with Firebase Auth
        const response = await auth().createUserWithEmailAndPassword(email, password);
        const uid = response.user.uid;

        // STEP 2 (Optional but Recommended): Set the display name on the Auth profile
        await response.user.updateProfile({
            displayName: username,
        });

        // STEP 3: Save the full profile (including username) to the Realtime Database
        const profile = await saveUserProfile(uid, email, username);

        // Return the full profile data to update the Redux state
        return profile;

    } catch (error) {
        console.error("Firebase Signup Error:", error);
        // Better error message handling might be needed here depending on Firebase response
        throw new Error('Signup failed. Email may already be in use or connection issue.');
    }
}


/**
 * Fetches the user profile from the Realtime Database after login.
 * @param uid The user's unique ID.
 * @returns The user's custom profile data.
 */
async function fetchUserProfile(uid: string) {
    // Reference to the user's profile in the 'users' collection
    const snapshot = await database().ref(`/users/${uid}`).once('value');

    if (snapshot.exists()) {
        return snapshot.val(); // Returns { uid, email, username, discovered, etc. }
    } else {
        // This should not happen if signup was successful, but handles edge case
        throw new Error("User profile not found in database.");
    }
}


/**
 * Handles user sign-in with email and password.
 * @param email
 * @param password
 * @returns A comprehensive user object including the profile data.
 */
export async function loginWithEmail(email: string, password: string) {
    try {
        // STEP 1: Authenticate the user with Firebase Auth
        const response = await auth().signInWithEmailAndPassword(email, password);
        const uid = response.user.uid;

        // STEP 2: Fetch the custom user profile data (including username) from the DB
        const profile = await fetchUserProfile(uid);

        // Return the full profile data to update the Redux state
        return profile;
    } catch (error) {
        console.error("Firebase Login Error:", error);
        // Firebase auth errors are often detailed; we return a generic message for security/simplicity
        throw new Error('Authentication failed. Check your credentials.');
    }
}
