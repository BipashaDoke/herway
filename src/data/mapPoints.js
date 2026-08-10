export const mapPoints = [
  // Safety (police, community safety)
  { id: 'pol-1', type: 'safety', name: 'Vadgaon Police Chowki', coords: [18.5202, 73.8580], description: 'Regular patrols, emergency assistance', status: 'Open 24/7' },
  { id: 'pol-2', type: 'safety', name: 'Sinhgad Campus Security', coords: [18.5204, 73.8567], description: 'Campus security booth', status: 'Open 8 AM–10 PM' },
  { id: 'pol-3', type: 'safety', name: 'Community Safety Kiosk', coords: [18.5190, 73.8575], description: 'Panic button available', status: 'Operational' },

  // Lighting
  { id: 'lit-1', type: 'lighting', name: 'Well‑lit Main Road', coords: [18.5200, 73.8565], description: 'LED streetlights, high coverage', status: 'Good' },
  { id: 'lit-2', type: 'lighting', name: 'Dimly Lit Lane', coords: [18.5210, 73.8590], description: 'Few streetlights, caution after 8 PM', status: 'Poor' },
  { id: 'lit-3', type: 'lighting', name: 'Campus Entrance Lighting', coords: [18.5205, 73.8570], description: 'Well‑lit, security cameras', status: 'Good' },

  // Emergency (hospitals, emergency services)
  { id: 'emer-1', type: 'emergency', name: 'Sinhgad Hospital', coords: [18.5212, 73.8555], description: '24/7 emergency, trauma center', status: 'Open' },
  { id: 'emer-2', type: 'emergency', name: 'Emergency Call Box', coords: [18.5198, 73.8568], description: 'Direct police line', status: 'Working' },
  { id: 'emer-3', type: 'emergency', name: 'Nearby Pharmacy (Emergency)', coords: [18.5199, 73.8564], description: 'Open till 11 PM', status: 'Open' },

  // Facilities (washroom, pharmacy, water, etc.)
  { id: 'fac-1', type: 'facilities', name: 'Public Washroom', coords: [18.5206, 73.8578], description: 'Clean, accessible', status: 'Open 8 AM–8 PM' },
  { id: 'fac-2', type: 'facilities', name: 'Women’s Rest Area', coords: [18.5195, 73.8562], description: 'Safe resting space, drinking water', status: 'Open' },
  { id: 'fac-3', type: 'facilities', name: 'Campus Pharmacy', coords: [18.5199, 73.8564], description: 'Menstrual products, first‑aid', status: 'Open' },

  // Transit
  { id: 'tr-1', type: 'transit', name: 'Vadgaon Bus Stop', coords: [18.5208, 73.8572], description: 'Frequent buses, auto stand nearby', status: 'Active' },
  { id: 'tr-2', type: 'transit', name: 'Sinhgad Road Metro Station (Planned)', coords: [18.5050, 73.8560], description: 'Future metro stop', status: 'Under construction' },
  { id: 'tr-3', type: 'transit', name: 'Auto Stand', coords: [18.5210, 73.8585], description: 'Available 6 AM–11 PM', status: 'Active' },

  // Shops (open commercial areas)
  { id: 'sh-1', type: 'shops', name: 'Cafe Corner', coords: [18.5195, 73.8575], description: 'Popular student cafe, open till 10 PM', status: 'Open' },
  { id: 'sh-2', type: 'shops', name: 'Grocery Store', coords: [18.5201, 73.8582], description: 'Essential supplies', status: 'Open' },
  { id: 'sh-3', type: 'shops', name: 'ATM / Bank', coords: [18.5205, 73.8560], description: '24‑hour ATM, well‑lit', status: 'Open' },

  // Alerts (reported incidents, warnings)
  { id: 'al-1', type: 'alerts', name: 'Safety Alert: Low activity after 9 PM', coords: [18.5207, 73.8590], description: 'Community report – avoid this stretch late at night', status: 'Warning' },
  { id: 'al-2', type: 'alerts', name: 'Broken Streetlight Reported', coords: [18.5200, 73.8585], description: 'Reported on 12 Aug, awaiting repair', status: 'Warning' },

  // Accessibility
  { id: 'acc-1', type: 'access', name: 'Accessible Entrance (College)', coords: [18.5204, 73.8567], description: 'Ramp, wide doors, elevator', status: 'Accessible' },
  { id: 'acc-2', type: 'access', name: 'Accessible Washroom', coords: [18.5206, 73.8578], description: 'Wheelchair‑friendly, grab bars', status: 'Open' },
  { id: 'acc-3', type: 'access', name: 'Tactile Path (Bus Stop)', coords: [18.5208, 73.8572], description: 'Tactile paving for visually impaired', status: 'Available' },
];