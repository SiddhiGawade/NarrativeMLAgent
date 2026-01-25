import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import './signup.css';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { handleGoogleSignIn } from './authHandlers';

const LoginForm = ({ onPasswordFocus, onPasswordBlur, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
      console.error("Error logging in:", err);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setError('');
    setLoading(true);
    const result = await handleGoogleSignIn();
    if (result.success && onNavigate) {
      onNavigate('dashboard');
    } else if (!result.success) {
      setError('Google Sign-In failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="signup-form w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
      </div>

      <form onSubmit={handleManualLogin}>
        <div className="signup-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="signup-group">
          <label htmlFor="password">Password</label>
          <div className="signup-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={onPasswordFocus}
              onBlur={onPasswordBlur}
              required
            />
            <span className="signup-password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
        </div>
        
        <div className="text-right mb-4">
          <a href="#" className="text-[#A0A0A0] text-sm hover:text-white transition-colors">Forgot password?</a>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Logging In...' : 'Log in'}
        </button>
        <button type="button" className="btn btn-google flex items-center justify-center gap-2 w-full" onClick={googleSignIn} disabled={loading}>
          <FcGoogle className="text-xl" /> Log in with Google
        </button>
      </form>

      <div className="signup-link-mod">
        <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('signup'); }}>Sign up</a></p>
      </div>
    </div>
  );
};

export default LoginForm;