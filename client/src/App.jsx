import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState({
    id: 1, // Matches seed/db user ID for kmack
    username: 'kmack',
    role: 'Supervisor'
  });

  const [activeShift, setActiveShift] = useState(null);

  // Optional: Check for any active shifts on mount
  useEffect(() => {
    const fetchActiveShifts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shifts');
        if (response.ok) {
          const shifts = await response.json();
          // Find the latest shift that is still Active
          const currentActive = shifts.find(s => s.status === 'Active');
          if (currentActive) {
            setActiveShift(currentActive);
          }
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    fetchActiveShifts();
  }, []);

  const handleStartShift = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      if (response.ok) {
        const newShift = await response.json();
        setActiveShift(newShift);
      } else {
        console.error('Failed to open shift on server');
      }
    } catch (err) {
      console.error('Error connecting to server to start shift:', err);
    }
  };

  const handleCloseShift = async () => {
    if (!activeShift) return;

    try {
      const response = await fetch(`http://localhost:5000/api/shifts/${activeShift.id}/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setActiveShift(null);
      } else {
        console.error('Failed to close shift on server');
      }
    } catch (err) {
      console.error('Error connecting to server to close shift:', err);
    }
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