import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

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
      navigate('/dashboard');
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
    <div className="flex min-h-screen items-center justify-center bg-moss-50 px-4">
      <Card className="w-full max-w-sm">

        <h1 className="mb-1 text-2xl font-semibold text-ink">
          Welcome back
        </h1>

        <p className="mb-6 text-sm text-ink/60">
          Log in to keep your goals on track.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Input
            id="email"
            label="Email"
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
            <p
              role="alert"
              className="rounded-card bg-red-50 p-3 text-sm text-ember"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            loading={loading}
            className="mt-2 w-full"
          >
            Log in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/60">
          No account?{' '}
          <Link
            to="/register"
            className="font-medium text-moss-700 hover:underline"
          >
            Register
          </Link>
        </p>

      </Card>
    </div>
  );
}