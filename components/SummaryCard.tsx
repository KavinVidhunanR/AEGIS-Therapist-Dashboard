import React from 'react';
import { SummaryRecord } from '../types';

interface SummaryCardProps {
  summary: SummaryRecord;
}

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block bg-[var(--bg-user)] text-[var(--text-main)] text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const { created_at, summary_data } = summary;
  const { moodCues, possibleStressors, suggestedFollowUp } = summary_data;

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg shadow-sm p-5 animate-fade-in-delayed">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--text-accent)]">
          Summary from {formattedDate}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold text-[var(--text-main)] mb-2">Mood Cues</h4>
        <div>
          {moodCues.length > 0 ? moodCues.map((cue, index) => <Tag key={index}>{cue}</Tag>) : <p className="text-sm text-[var(--text-muted)]">None identified.</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-semibold text-[var(--text-main)] mb-2">Possible Stressors</h4>
        <div>
           {possibleStressors.length > 0 ? possibleStressors.map((stressor, index) => <Tag key={index}>{stressor}</Tag>) : <p className="text-sm text-[var(--text-muted)]">None identified.</p>}
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-semibold text-[var(--text-main)] mb-2">Suggested Follow-Up</h4>
        <p className="text-sm text-[var(--text-main)] leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-200">
          {suggestedFollowUp || "No specific follow-up suggested."}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;