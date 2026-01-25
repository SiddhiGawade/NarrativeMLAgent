import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import './signup.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { handleGoogleSignIn } from './authHandlers'; // Import the shared function

const SignupForm = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        email,
        uid: user.uid,
      };

      try {
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), 5000));
        const writePromise = setDoc(doc(db, 'users', user.uid), userData);
        const raceResult = await Promise.race([writePromise, timeoutPromise]);

        if (raceResult === 'timeout') {
          console.warn("Firestore write timed out, skipping document creation to allow navigation.");
        }
      } catch (writeErr) {
        console.error("Error writing user document (non-fatal):", writeErr);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error signing up:', err);
      let errorMessage = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    console.log("googleSignIn initiated");
    setError('');
    setLoading(true);
    try {
      const result = await handleGoogleSignIn();
      console.log("handleGoogleSignIn returned:", result);
      
      if (result.success) {
        console.log("Navigating to dashboard...");
        navigate('/dashboard');
      } else {
        setError(result.error || 'Google Sign-Up failed. Please try again.');
      }
    } catch (e) {
      console.error("Unexpected error in googleSignIn:", e);
      setError('An unexpected error occurred: ' + e.message);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  return (
    <div className="signup-form w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Create your account</h2>
      </div>

      <form onSubmit={handleManualSignUp}>
        <div className="signup-group">
          <label htmlFor="first">First name</label>
          <input type="text" id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="signup-group">
          <label htmlFor="last">Last name</label>
          <input type="text" id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="signup-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="signup-group">
          <label htmlFor="password">Password</label>
          <div className="signup-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="signup-password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign up'}
        </button>
        <button type="button" className="btn btn-google flex items-center justify-center gap-2 w-full" onClick={googleSignIn} disabled={loading}>
          <FcGoogle className="text-xl" /> Sign up with Google
        </button>
      </form>

      <div className="signup-link-mod">
        <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Log in</a></p>
      </div>
    </div>
  );
};

export default SignupForm;