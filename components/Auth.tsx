import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    
    try {
      let error;
      if (authMode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        error = signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        if (signUpError) {
          error = signUpError;
        } else {
          setMessage("Sign up successful! Please check your email for a confirmation link.");
          setAuthMode('signin'); // Switch back to sign in view
        }
      }
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setMessage(null);
    setAuthMode(prevMode => prevMode === 'signin' ? 'signup' : 'signin');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-12 px-8 shadow-md rounded-2xl">
          
          <div className="flex items-center gap-4 mb-8">
            <img src="/aegis-logo.svg" alt="AEGIS Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-heading)] tracking-tight">AEGIS</h1>
              <p className="text-sm text-[var(--text-muted)]">Mind, Health, Voice</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-8">
            {authMode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="appearance-none block w-full px-3 py-3 border border-[var(--border-color)] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none block w-full px-3 py-3 border border-[var(--border-color)] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] sm:text-sm"
              />
            </div>
            
            {error && <p className="text-sm text-red-600 animate-fade-in">{error}</p>}
            {message && <p className="text-sm text-green-600 animate-fade-in">{message}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-light)] bg-[var(--bg-accent)] hover:bg-[var(--bg-accent-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--bg-accent-darker)] disabled:opacity-50 transition-colors"
              >
                {loading ? (authMode === 'signin' ? 'Signing in...' : 'Creating account...') : (authMode === 'signin' ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-sm">
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