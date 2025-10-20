import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const AccessDeniedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] p-4">
    <div className="w-full max-w-md text-center bg-[var(--bg-subtle)] p-8 rounded-lg shadow-md border border-[var(--border-color)]">
        <h1 className="text-2xl font-bold text-[var(--bg-accent)]">Access Denied</h1>
        <p className="mt-4 text-[var(--text-main)]">You have accessed the incorrect application.</p>
        <p className="mt-2 text-[var(--text-muted)]">This dashboard is for authorized therapists only. Please sign out and use the AEGIS app for teens if you are a patient.</p>
        <button
            onClick={() => supabase.auth.signOut()}
            className="w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-light)] bg-[var(--bg-accent)] hover:bg-[var(--bg-accent-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--bg-accent-darker)] transition-colors"
        >
            Sign Out
        </button>
    </div>
  </div>
);

const ConfigurationErrorPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg text-center bg-red-50 p-8 rounded-lg shadow-md border border-red-200">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-red-800">Configuration Error</h1>
          <p className="mt-4 text-red-700">This application is not properly configured to connect to its backend services.</p>
          <p className="mt-2 text-sm text-red-600">If you are the administrator, please ensure the Supabase environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are set correctly in your hosting environment (e.g., Vercel).</p>
      </div>
    </div>
);


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isTherapist, setIsTherapist] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent API calls if the client is not configured.
    if (!isSupabaseConfigured) {
        setLoading(false);
        return;
    }

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Prevent API calls if the client is not configured.
    if (!isSupabaseConfigured) return;

    const checkTherapistRole = async () => {
      if (session?.user?.id) {
        setIsTherapist(null); // Reset while checking
        try {
          const { data, error } = await supabase
            .from('therapists')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
            console.error('Error checking therapist role:', error);
            setIsTherapist(false);
          } else {
            setIsTherapist(!!data);
          }
        } catch (error) {
          console.error('Exception checking therapist role:', error);
          setIsTherapist(false);
        }
      } else {
        setIsTherapist(null);
      }
    };

    checkTherapistRole();
  }, [session]);

  if (!isSupabaseConfigured) {
    return <ConfigurationErrorPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-[var(--text-muted)]">Loading Application...</div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }
  
  if (isTherapist === null) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-[var(--text-muted)]">Verifying your credentials...</div>
      </div>
    );
  }

  if (isTherapist === false) {
    return <AccessDeniedPage />;
  }

  return <Dashboard key={session.user.id} session={session} />;
};

export default App;
