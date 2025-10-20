import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AegisLogo from './AegisLogo';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Sign up successful! Please check your email for a confirmation link. Your account will require administrator approval before you can log in.");
        setAuthMode('signin'); // Switch back to sign in view
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleMode = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setMessage(null);
    setAuthMode(prevMode => prevMode === 'signin' ? 'signup' : 'signin');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-fit">
            <AegisLogo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-heading)]">
          Therapist Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
          {authMode === 'signin' ? 'Sign in to your professional account' : 'Create a new professional account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--bg-subtle)] py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-[var(--border-color)]">
          <form className="space-y-6" onSubmit={authMode === 'signin' ? handleLogin : handleSignUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-main)]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[var(--border-color)] rounded-md shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[var(--bg-accent)] focus:border-[var(--bg-accent)] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-main)]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[var(--border-color)] rounded-md shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[var(--bg-accent)] focus:border-[var(--bg-accent)] sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 animate-fade-in">{error}</p>}
            {message && <p className="text-sm text-green-600 animate-fade-in">{message}</p>}


            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-light)] bg-[var(--bg-accent)] hover:bg-[var(--bg-accent-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--bg-accent-darker)] disabled:opacity-50 transition-colors"
              >
                {loading ? (authMode === 'signin' ? 'Signing in...' : 'Signing up...') : (authMode === 'signin' ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-sm text-center">
             <p className="text-[var(--text-muted)]">
                {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-[var(--text-accent)] hover:underline focus:outline-none"
                >
                  {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;