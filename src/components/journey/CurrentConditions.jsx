import Card from '../ui/Card';
import Badge from '../ui/Badge';

const CurrentConditions = ({ conditions }) => {
  if (!conditions) return null;
  return (
    <Card className="space-y-2">
      <h3 className="font-medium text-plum">Current Conditions</h3>
      <div className="space-y-1 text-sm">
        {Object.entries(conditions).map(([key, val]) => (
          <div key={key} className="flex justify-between">
            <span>{key}</span>
            <Badge variant={val === 'Good' ? 'safe' : val === 'Moderate' ? 'caution' : 'concern'}>
              {val}
            </Badge>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary">Last updated: {new Date().toLocaleTimeString()}</p>
    </Card>
  );
};

export default CurrentConditions;