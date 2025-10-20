import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { TeenProfile, SummaryRecord, TherapistProfile } from '../types';
import PatientList from './PatientList';
import SummaryCard from './SummaryCard';
import AegisLogo from './AegisLogo';

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const [therapist, setTherapist] = useState<TherapistProfile | null>(null);
  const [patients, setPatients] = useState<TeenProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<SummaryRecord[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingSummaries, setLoadingSummaries] = useState(false);

  useEffect(() => {
    const fetchTherapistProfile = async () => {
        const { data, error } = await supabase
            .from('therapists')
            .select('id, full_name')
            .eq('id', session.user.id)
            .single();
        
        if (error) {
            console.error("Error fetching therapist profile:", error);
        } else if (data) {
            setTherapist(data);
        }
    };

    const fetchPatients = async () => {
      setLoadingPatients(true);
      const { data: assignments, error: assignmentsError } = await supabase
        .from('therapist_teen_assignments')
        .select('teen_id')
        .eq('therapist_id', session.user.id);
      
      if (assignmentsError) {
        console.error('Error fetching patient assignments:', assignmentsError);
        setLoadingPatients(false);
        return;
      }
      
      if (assignments && assignments.length > 0) {
        const teenIds = assignments.map(a => a.teen_id);
        const { data: teensData, error: teensError } = await supabase
          .from('teens')
          .select('id, unique_display_id, consent_to_share')
          .in('id', teenIds);

        if (teensError) {
          console.error('Error fetching teen profiles:', teensError);
        } else if (teensData) {
          setPatients(teensData as TeenProfile[]);
        }
      }
      setLoadingPatients(false);
    };
    
    fetchTherapistProfile();
    fetchPatients();
  }, [session.user.id]);

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!selectedPatientId) return;

      setLoadingSummaries(true);
      setSummaries([]);
      const { data, error } = await supabase
        .from('summaries')
        .select('id, created_at, teen_id, summary_data')
        .eq('teen_id', selectedPatientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching summaries:', error);
      } else if (data) {
        setSummaries(data as SummaryRecord[]);
      }
      setLoadingSummaries(false);
    };

    fetchSummaries();
  }, [selectedPatientId]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg-main)]">
      <header className="flex-shrink-0 bg-[var(--bg-subtle)] border-b border-[var(--border-color)] flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <AegisLogo size="small" />
          <h1 className="text-xl font-bold text-[var(--text-heading)] hidden sm:block">Therapist Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-[var(--text-main)] hidden md:inline">Welcome, <span className="font-semibold">{therapist?.full_name || '...'}</span></span>
          <button 
            onClick={handleSignOut}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-light)] bg-[var(--bg-accent)] hover:bg-[var(--bg-accent-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--bg-accent-darker)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <aside className="w-64 bg-[var(--bg-subtle)] border-r border-[var(--border-color)] flex-shrink-0 overflow-y-auto">
           <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            isLoading={loadingPatients}
           />
        </aside>

        <main className="flex-grow p-6 overflow-y-auto">
          {selectedPatientId ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">
                Session Summaries for Patient <span className="text-[var(--text-accent)]">{patients.find(p => p.id === selectedPatientId)?.unique_display_id}</span>
              </h2>
              {loadingSummaries ? (
                <p className="text-[var(--text-muted)]">Loading summaries...</p>
              ) : summaries.length > 0 ? (
                <div className="space-y-4">
                  {summaries.map(summary => (
                    <SummaryCard key={summary.id} summary={summary} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-color)]">
                  <h3 className="text-lg font-medium text-[var(--text-heading)]">No Summaries Available</h3>
                  <p className="mt-1 text-[var(--text-muted)]">No summaries are available for this patient yet.</p>
                </div>
              )}
            </div>
          ) : (
             <div className="h-full flex items-center justify-center">
                <div className="text-center text-[var(--text-muted)]">
                  <p className="text-lg">Please select a patient from the list to view their summaries.</p>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;