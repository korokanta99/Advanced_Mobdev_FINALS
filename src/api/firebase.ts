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
 * Updates specific fields in the user's profile
 */
export async function updateUserDoc(uid: string, data: any) {
    try {
        await firestore().collection('users').doc(uid).update(data);
    } catch (error) {
        console.error("Update Error:", error);
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

/**
 * Signs the user out of Firebase Authentication
 */
export async function signOutUser() {
    try {
        await auth().signOut();
    } catch (error) {
        console.error("Signout Error:", error);
        throw error;
    }
}

/**
 * Fetches the most recent 20 posts from the community feed.
 */
export function subscribeToFeed(onUpdate: (posts: any[]) => void) {
    // .onSnapshot creates a real-time listener
    return firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .onSnapshot(
            (snapshot) => {
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt
                        ? doc.data().createdAt.toDate().toISOString()
                        : new Date().toISOString()
                }));
                // Send the fresh data to the callback
                onUpdate(posts);
            },
            (error) => {
                console.error("Feed Listener Error:", error);
            }
        );
}

/**
 * Creates a new post in the community feed.
 */
export async function submitPost(uid: string, username: string, content: string, gender: string) {
    try {
        await firestore().collection('posts').add({
            uid,
            username,
            content,
            gender: gender || 'male', // 🟢 Save Gender (Default to male if missing)
            likes: 0,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error("Submit Post Error:", error);
        throw error;
    }
}

/**
 * Saves a captured Pokemon ID to the user's "discovered" list in Firestore.
 * Uses arrayUnion to ensure we don't add duplicates.
 */
export async function saveCapturedPokemon(uid: string, pokemonId: number) {
    try {
        await firestore().collection('users').doc(uid).update({
            discovered: firestore.FieldValue.arrayUnion(pokemonId)
        });
    } catch (error) {
        console.error("Save Pokemon Error:", error);
        throw error;
    }
}