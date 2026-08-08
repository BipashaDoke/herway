import Card from '../components/ui/Card';
import { User } from 'lucide-react';

const Profile = () => (
  <div className="max-w-2xl mx-auto p-6 space-y-4">
    <h1 className="text-2xl font-bold text-plum">Profile</h1>
    <Card className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center text-rose">
        <User size={24} />
      </div>
      <div>
        <p className="font-medium">Welcome to HerWay</p>
        <p className="text-sm text-text-secondary">Profile settings and journey history coming soon.</p>
      </div>
    </Card>
  </div>
);

export default Profile;