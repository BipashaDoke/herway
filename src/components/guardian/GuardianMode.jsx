// src/components/guardian/GuardianMode.jsx
import { useState } from 'react';
import { Shield, User } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const GuardianMode = () => {
  const [active, setActive] = useState(false);

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield size={20} className={active ? 'text-safe' : 'text-text-secondary'} />
        <h3 className="font-medium">{active ? 'Guardian Mode Active' : 'Guardian Mode'}</h3>
      </div>
      {!active ? (
        <div>
          <p className="text-sm text-text-secondary mb-3">
            Share your journey with trusted contacts
          </p>
          <Button onClick={() => setActive(true)} variant="primary" size="sm">
            Start Guardian Mode
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 text-sm text-safe mb-3">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            Location sharing is ON
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
            <User size={14} />
            Mom (demo)
          </div>
          <Button onClick={() => setActive(false)} variant="secondary" size="sm">
            Stop Guardian Mode
          </Button>
        </div>
      )}
    </Card>
  );
};

export default GuardianMode;