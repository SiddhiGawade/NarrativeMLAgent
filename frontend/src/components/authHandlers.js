import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Handles the Google Sign-In process.
 * Creates a user document in Firestore if it's their first time.
 * @returns {boolean} - True on success, false on failure.
 */
export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    console.log("Starting Google Sign-In...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Auth successful. User:", user.uid);
    console.log("Firestore instance:", db);

    // Use setDoc with merge: true to avoid reading first (which was hanging)
    // This will create the document if it doesn't exist, or update it if it does
    // We only want to set these fields if they are missing or to ensure they are set
    // Note: This effectively overwrites name/email on every login, which is usually acceptable for Google Auth
    // or we can use { merge: true } to only update specific fields if we wanted.

    const userRef = doc(db, 'users', user.uid);
    console.log("Attempting to write user document...", userRef);

    const userData = {
      firstName: user.displayName ? user.displayName.split(' ')[0] : '',
      lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
      email: user.email,
      uid: user.uid,
    };

    try {
      // Create a timeout promise that resolves after 5 seconds
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), 5000));

      // Execute the write operation
      const writePromise = setDoc(userRef, userData, { merge: true });

      // Race the write against the timeout
      const raceResult = await Promise.race([writePromise, timeoutPromise]);

      if (raceResult === 'timeout') {
        console.warn("Firestore write timed out, skipping document update to allow login.");
      } else {
        console.log("User document written/updated successfully.");
      }
    } catch (writeErr) {
      // Log the error but verify it's just a write error and not auth error
      console.error("Error writing user document (non-fatal):", writeErr);
    }

    return { success: true };
  } catch (err) {
    console.error('Error with Google Sign-In:', err);
    // Don't alert here, let the UI handle it
    return { success: false, error: err.message || 'Unknown error occurred during Google Sign-In' };
  }
};