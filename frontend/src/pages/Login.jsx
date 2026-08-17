import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { Target, Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      let msg = 'Failed to log in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target size={22} className="text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-white tracking-tight block">AI Goal Journal</span>
            <span className="text-xs text-slate-400 font-normal">Accountability Coach</span>
          </div>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-white text-center">
          Welcome Back
        </h1>

        <p className="mb-6 text-xs text-slate-400 text-center">
          Log in with Firebase Authentication to sync your goals and profile.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p role="alert" className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="mt-2 w-full">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
            Register Account
          </Link>
        </p>
      </Card>
    </div>
  );
}
