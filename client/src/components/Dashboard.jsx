import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, activeShift, onStartShift, onCloseShift }) => {
    const [checklist, setChecklist] = useState([
        { id: 1, task: 'Perimeter and Access Control Check', completed: true, notes: 'All entry points secured.' },
        { id: 2, task: 'CCTV and Monitoring Systems Audit', completed: false, notes: 'Pending visual inspection.' },
        { id: 3, task: 'Incident Log and Radio Check', completed: false, notes: '' },
        { id: 4, task: 'End-of-Shift Handover Briefing', completed: false, notes: '' }
    ]);

    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/checklist');
                if (response.ok) {
                    const data = await response.json();
                    setChecklist(data);
                } else {
                    console.error('Failed to fetch checklist from server');
                }
            } catch (err) {
                console.error('Error connecting to server for checklist:', err);
            }
        };

        fetchChecklist();
    }, []);

    const toggleItem = async (id) => {
        const itemToUpdate = checklist.find(item => item.id === id);
        if (!itemToUpdate) return;

        const newCompletedStatus = !itemToUpdate.completed;

        setChecklist(checklist.map(item => 
            item.id === id ? { ...item, completed: newCompletedStatus } : item
        ));

        try {
            const response = await fetch(`http://localhost:5000/api/checklist/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: newCompletedStatus, notes: itemToUpdate.notes })
            });
            
            if (!response.ok) {
                console.error('Failed to update checklist item on server');
            }
        } catch (err) {
            console.error('Error syncing checklist state with server:', err);
        }
    };

    const completedCount = checklist.filter(item => item.completed).length;
    const progressPercentage = Math.round((completedCount / checklist.length) * 100);

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shift Status</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {activeShift ? 'Active Operations' : 'Standby'}
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">● Systems operational</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Checklist Progress</p>
                    <p className="text-2xl font-bold text-white mt-1">{completedCount} / {checklist.length}</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operator Role</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1 uppercase">{user ? user.role : 'Staff'}</p>
                    <p className="text-xs text-slate-400 mt-2">Permissions verified</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</p>
                        <p className="text-sm font-medium text-slate-200 mt-1">Manage Shift State</p>
                    </div>
                    {activeShift ? (
                        <button 
                            onClick={onCloseShift}
                            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors">
                            Close & Sign Off Shift
                        </button>
                    ) : (
                        <button 
                            onClick={onStartShift}
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors">
                            Open New Shift
                        </button>
                    )}
                </div>
            </div>

            {/* Interactive Operations Checklist */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-white">Active Shift Audit Checklist</h2>
                        <p className="text-xs text-slate-400">Complete all required security and operational verification steps.</p>
                    </div>
                    <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-mono">
                        {progressPercentage}% Completed
                    </span>
                </div>

                <div className="space-y-3">
                    {checklist.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => toggleItem(item.id)}
                            className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                                item.completed 
                                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300' 
                                    : 'bg-slate-900/40 border-slate-700/60 text-slate-100 hover:border-slate-600'
                            }`}
                        >
                            <div className="flex items-center space-x-4">
                                <input 
                                    type="checkbox" 
                                    checked={item.completed} 
                                    onChange={() => {}} 
                                    className="h-5 w-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                                />
                                <div>
                                    <p className={`text-sm font-medium ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                                        {item.task}
                                    </p>
                                    {item.notes && <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>}
                                </div>
                            </div>
                            <div>
                                <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                                    item.completed ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50' : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}>
                                    {item.completed ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;