import React, { useEffect, useState } from 'react';
import { Eye, TrendingUp, Sun, Moon, Activity, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import snaLogo from '../assets/SNA_Logo.png';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
           const userDocRef = doc(db, 'users', currentUser.uid);
           const userDocSnap = await getDoc(userDocRef);
           
           if (userDocSnap.exists()) {
             setUserName(userDocSnap.data().firstName);
           } else if (currentUser.displayName) {
             setUserName(currentUser.displayName.split(' ')[0]);
           } else {
             setUserName('User');
           }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserName(currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'User');
        }
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-6 border-b border-[#fca311]/20 dark:border-white/5 bg-white/60 dark:bg-[#050510]/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-300">
      <div className="flex items-center gap-3 group">
        <Link to="/">
          <img src={snaLogo} alt="SNA Logo" className="h-[50px] w-auto object-contain hover:scale-105 transition-transform duration-300" />
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm font-mono">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-[#ffffff]/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors flex items-center gap-2 hover:text-[#fca311] dark:hover:text-cyan-400">
           <LayoutDashboard size={18} />
           <span className="hidden sm:inline">Dashboard</span>
        </Link>
        
        {/* Theme Toggle */}
        <Link to="/metrics" className="p-2 rounded-lg hover:bg-[#ffffff]/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors flex items-center gap-2 hover:text-[#fca311] dark:hover:text-cyan-400">
           <Activity size={18} />
           <span className="hidden sm:inline">Model Accuracy</span>
        </Link>
        
        {/* Conditional Rendering for Auth */}
        {user ? (
          <div className="flex items-center gap-4">
             <span className="text-slate-700 dark:text-white font-semibold text-base">
               Hi, {userName}
             </span>
             <button 
               onClick={handleLogout}
               className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
               title="Logout"
             >
               <LogOut size={18} />
             </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="p-2 rounded-lg hover:bg-[#ffffff]/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors font-semibold hover:text-[#fca311] dark:hover:text-cyan-400">
                Login
            </Link>
            <Link to="/signup" className="px-4 py-2 rounded-lg bg-[#fca311] hover:bg-[#fca311]/90 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105">
                Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
