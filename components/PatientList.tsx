import React from 'react';
import { TeenProfile } from '../types';

interface PatientListProps {
  patients: TeenProfile[];
  selectedPatientId: string | null;
  onSelectPatient: (id: string) => void;
  isLoading: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, selectedPatientId, onSelectPatient, isLoading }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-3 px-2">Assigned Patients</h3>
      {isLoading ? (
        <div className="px-2 text-[var(--text-muted)]">Loading patients...</div>
      ) : patients.length > 0 ? (
        <ul className="space-y-1">
          {patients.map((patient) => (
            <li key={patient.id}>
              <button
                onClick={() => onSelectPatient(patient.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPatientId === patient.id
                    ? 'bg-[var(--bg-accent-subtle)] text-[var(--text-accent)]'
                    : 'text-[var(--text-main)] hover:bg-gray-100'
                }`}
              >
                {patient.unique_display_id}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-2 text-sm text-[var(--text-muted)]">No patients assigned.</div>
      )}
    </div>
  );
};

export default PatientList;