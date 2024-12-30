import React from 'react';
import { AppContent } from './components/layout/AppContent';
import { AudioProvider } from './contexts/AudioContext';

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}