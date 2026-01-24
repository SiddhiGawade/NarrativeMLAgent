import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import AnimatedCharacters from '../components/AnimatedCharacters';
import '../components/signup.css'; // Ensure common styles are loaded

const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (target) => {
    if (target === 'dashboard') {
      navigate('/dashboard');
    } else if (target === 'login') {
      setMode('login');
      navigate('/login');
    } else if (target === 'signup') {
      setMode('signup');
      navigate('/signup');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Animated Characters (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-[#E6E6FA] items-center justify-center relative overflow-hidden">
        <div className="transform scale-125">
           <AnimatedCharacters isPasswordFocused={isPasswordFocused} />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-[#050510] flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {mode === 'login' ? (
            <LoginForm 
              onPasswordFocus={() => setIsPasswordFocused(true)}
              onPasswordBlur={() => setIsPasswordFocused(false)}
              onNavigate={handleNavigate}
            />
          ) : (
            <SignupForm 
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
