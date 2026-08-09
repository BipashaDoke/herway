export const routeMarkers = [
  // lighting markers
  { id: 'lt1', type: 'lighting', coords: [18.5195, 73.8575], title: 'Good Lighting', description: 'Lighting coverage: High', confidence: 82, timeNote: { day: 'Well-lit', night: 'Well-lit' } },
  { id: 'lt2', type: 'lighting', coords: [18.5210, 73.8555], title: 'Moderate Lighting', description: 'Lighting coverage: Moderate', confidence: 65, timeNote: { day: 'Adequate', night: 'Dim after 8 PM' } },
  // police
  { id: 'pol1', type: 'police', coords: [18.5202, 73.8580], title: 'Police Chowki', description: '450m from route', confidence: 90, timeNote: { day: 'Open', night: 'Open 24/7' } },
  // hospital
  { id: 'hos1', type: 'hospital', coords: [18.5212, 73.8555], title: 'Sinhgad Hospital', description: 'Emergency services', confidence: 92, timeNote: { day: 'Open', night: 'Open 24/7' } },
  // washroom
  { id: 'wr1', type: 'washroom', coords: [18.5199, 73.8564], title: 'Public Washroom', description: 'Clean, accessible', confidence: 78, timeNote: { day: 'Open 8 AM–8 PM', night: 'Closed' } },
  // menstrual facilities
  { id: 'mf1', type: 'menstrual', coords: [18.5199, 73.8564], title: 'Pharmacy (Menstrual Products)', description: 'Available', confidence: 85, timeNote: { day: 'Open', night: 'Open till 10 PM' } },
  // bus stop
  { id: 'bus1', type: 'bus', coords: [18.5208, 73.8572], title: 'Vadgaon Bus Stop', description: 'Frequent buses', confidence: 88, timeNote: { day: 'Regular', night: 'Reduced after 10 PM' } },
  // metro (mock)
  { id: 'met1', type: 'metro', coords: [18.5180, 73.8600], title: 'Metro Station (Planned)', description: 'Not yet operational', confidence: 50, timeNote: { day: 'N/A', night: 'N/A' } },
  // open shops
  { id: 'shop1', type: 'shop', coords: [18.5195, 73.8575], title: 'Cafe Corner', description: 'Open till 11 PM', confidence: 80, timeNote: { day: 'Open', night: 'Open until 11 PM' } },
  // high activity area
  { id: 'act1', type: 'activity', coords: [18.5205, 73.8565], title: 'College Main Gate', description: 'High footfall', confidence: 90, timeNote: { day: 'Crowded', night: 'Low after 9 PM' } },
  // safety alert
  { id: 'alert1', type: 'alert', coords: [18.5200, 73.8585], title: 'Safety Alert', description: 'Lower activity after 9 PM', confidence: 70, timeNote: { day: 'Safe', night: 'Be cautious' } },
  // emergency point
  { id: 'emer1', type: 'emergency', coords: [18.5210, 73.8570], title: 'Emergency Call Box', description: 'Direct police line', confidence: 95, timeNote: { day: 'Working', night: 'Working' } },
  // accessible facility
  { id: 'acc1', type: 'accessibility', coords: [18.5198, 73.8568], title: 'Accessible Entrance', description: 'Ramp available', confidence: 85, timeNote: { day: 'Open', night: 'Open' } },
  // safe zone
  { id: 'safe1', type: 'safeZone', coords: [18.5204, 73.8567], title: 'College Campus', description: 'Security patrolled', confidence: 93, timeNote: { day: 'Safe', night: 'Safe, guard present' } },
];