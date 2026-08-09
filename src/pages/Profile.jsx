import { useUserPreferences } from '../context/UserPreferencesContext';
import Card from '../components/ui/Card';
import { User, Shield, Accessibility, Clock, Moon, Footprints, Bus, Users, Lock, FileText, EyeOff } from 'lucide-react';

const Profile = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-plum">Profile</h1>

      {/* My Preferences */}
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User size={20} className="text-rose" /> My Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Shield size={16} /> Safety Priority</span>
            <input
              type="range" min="0" max="100" value={preferences.safety}
              onChange={e => updatePreferences({ safety: parseInt(e.target.value) })}
              className="w-32 accent-plum"
            />
            <span className="w-8 text-right">{preferences.safety}%</span>
          </label>

          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Clock size={16} /> Time Priority</span>
            <input type="range" min="0" max="100" value={preferences.time}
              onChange={e => updatePreferences({ time: parseInt(e.target.value) })}
              className="w-32 accent-plum" />
            <span>{preferences.time}%</span>
          </label>

          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Accessibility size={16} /> Accessibility</span>
            <input type="range" min="0" max="100" value={preferences.accessibility}
              onChange={e => updatePreferences({ accessibility: parseInt(e.target.value) })}
              className="w-32 accent-plum" />
            <span>{preferences.accessibility}%</span>
          </label>

          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Shield size={16} /> Facilities</span>
            <input type="range" min="0" max="100" value={preferences.facilities}
              onChange={e => updatePreferences({ facilities: parseInt(e.target.value) })}
              className="w-32 accent-plum" />
            <span>{preferences.facilities}%</span>
          </label>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={preferences.avoidStairs}
              onChange={e => updatePreferences({ avoidStairs: e.target.checked })}
              className="rounded text-plum focus:ring-plum" />
            <Footprints size={16} /> Avoid stairs
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={preferences.preferPublicTransport}
              onChange={e => updatePreferences({ preferPublicTransport: e.target.checked })}
              className="rounded text-plum focus:ring-plum" />
            <Bus size={16} /> Prefer public transport
          </label>
          <div className="text-sm flex items-center gap-2">
            <Moon size={16} />
            <span>Night travel:</span>
            <select value={preferences.nightTravelPreference}
              onChange={e => updatePreferences({ nightTravelPreference: e.target.value })}
              className="ml-2 border border-gray-200 rounded-lg p-1 text-xs">
              <option value="avoid">Avoid</option>
              <option value="neutral">Neutral</option>
              <option value="prefer">Prefer</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Trusted Guardians */}
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} className="text-rose" /> Trusted Guardians
        </h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center text-rose">
            <User size={20} />
          </div>
          <div>
            <p className="font-medium">Mom</p>
            <p className="text-xs text-text-secondary">Always notified during Guardian Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center text-rose">
            <User size={20} />
          </div>
          <div>
            <p className="font-medium">Sister</p>
            <p className="text-xs text-text-secondary">Notified only for evening journeys</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary">* Demo contacts – real guardian management coming soon.</p>
      </Card>

      {/* Privacy */}
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lock size={20} className="text-rose" /> Privacy
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <EyeOff size={16} />
            <span>Location sharing only during Guardian Mode</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText size={16} />
            <span>Anonymous community reports</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock size={16} />
            <span>Private journey history</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;