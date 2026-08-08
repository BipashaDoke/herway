// src/components/reports/QuickReport.jsx
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const issueTypes = [
  'Poor lighting',
  'Unsafe area',
  'Broken streetlight',
  'Unsafe bus stop',
  'Washroom issue',
  'Security issue',
  'Other',
];

const QuickReport = ({ onReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const report = {
      id: Date.now(),
      type: selectedIssue || 'General',
      description,
      timestamp: new Date().toISOString(),
      location: 'Current map location', // we could get lat/lng from context later
    };
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('herway_reports') || '[]');
    existing.push(report);
    localStorage.setItem('herway_reports', JSON.stringify(existing));
    setSubmitted(true);
    if (onReport) onReport(report);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setSelectedIssue('');
      setDescription('');
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-rose/10 transition-colors md:bottom-6 md:right-6"
        aria-label="Quick Report"
      >
        <AlertTriangle size={20} className="text-concern" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/20">
      <div className="w-full max-w-md bg-surface rounded-t-2xl p-4 pb-8 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-plum">Report an issue</h3>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {issueTypes.map((issue) => (
              <button
                key={issue}
                onClick={() => setSelectedIssue(issue)}
                className={`p-2 rounded-xl text-sm border transition-colors ${
                  selectedIssue === issue
                    ? 'border-plum bg-plum/10 text-plum'
                    : 'border-gray-200 hover:bg-ivory'
                }`}
              >
                {issue}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Optional description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plum/20"
            rows={3}
          />
          <Button onClick={handleSubmit} disabled={submitted} className="w-full">
            {submitted ? 'Report submitted!' : 'Submit Report'}
          </Button>
          {submitted && (
            <p className="text-xs text-safe text-center">✅ Report saved locally.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickReport;