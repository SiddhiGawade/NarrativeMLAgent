import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import snaLogo from '../assets/SNA_Logo.png'; // Using existing logo as placeholder
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'; // This might fail if firebase not installed, but checking package.json it was installed.
import { handleGoogleSignIn } from './authHandlers'; // Import the shared function

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
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setError('');
    setLoading(true);
    const success = await handleGoogleSignIn();
    if (success && onNavigate) {
      onNavigate('dashboard');
    } else if (!success) {
      setError('Google Sign-In failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-form w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back!</h2>
        <p className="text-slate-300 mt-2">Please enter your details to sign in.</p>
      </div>

      <form onSubmit={handleManualLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={onPasswordFocus}
              onBlur={onPasswordBlur}
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <div className="form-options">
          <a href="#" className="forgot-password text-slate-300 hover:text-white">Forgot password?</a>
        </div>

        <button type="submit" className="btn btn-login" disabled={loading}>
          {loading ? 'Logging In...' : 'Log in'}
        </button>
        <button type="button" className="btn btn-google flex items-center justify-center gap-2 w-full" onClick={googleSignIn} disabled={loading}>
          <FcGoogle className="text-xl" /> Log in with Google
        </button>
      </form>

      <div className="signup-link mt-4 text-center">
        <p className="text-slate-300">Don't have an account? <a href="#" className="text-white font-medium hover:underline" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('signup'); }}>Sign up</a></p>
      </div>
    </div>
  );
};

export default LoginForm;