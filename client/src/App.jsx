import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function App() {
  // Mock current logged-in operator (will connect to auth API in Phase 4)
  const [user, setUser] = useState({
    id: 101,
    username: 'kmack',
    role: 'Supervisor'
  });

  // Shift tracking state
  const [activeShift, setActiveShift] = useState(null);

  const handleStartShift = () => {
    setActiveShift({
      id: Math.floor(1000 + Math.random() * 9000),
      startTime: new Date().toLocaleTimeString()
    });
  };

  const handleCloseShift = () => {
    setActiveShift(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar user={user} activeShift={activeShift} />
      <div className="flex-1">
        <Dashboard 
          user={user} 
          activeShift={activeShift} 
          onStartShift={handleStartShift} 
          onCloseShift={handleCloseShift} 
        />
      </div>
      <footer className="bg-slate-800 border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        Shift Audit Engine &bull; Operations & Compliance Platform &bull; AWS RDS Backed
      </footer>
    </div>
  );
}

export default App;