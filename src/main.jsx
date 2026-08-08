import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './lib/leaflet-setup';
import 'leaflet/dist/leaflet.css';
import './herway.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);