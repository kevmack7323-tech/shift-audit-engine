import React from 'react';

const Navbar = ({ user, activeShift }) => {
    return (
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-md">
            {/* Brand / Title */}
            <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-lg">
                    🛡️
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-wide text-white">Shift Audit Engine</h1>
                    <p className="text-xs text-slate-400">Operations Control & Compliance Hub</p>
                </div>
            </div>

            {/* System Status & Active Shift Badge */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-slate-300">Supabase Live</span>
                </div>

                {activeShift ? (
                    <div className="bg-emerald-900/30 border border-emerald-700/50 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                        <span className="text-xs text-emerald-400 font-semibold">SHIFT ACTIVE</span>
                        <span className="text-xs text-slate-300">#{activeShift.id}</span>
                    </div>
                ) : (
                    <div className="bg-amber-900/30 border border-amber-700/50 px-3 py-1.5 rounded-lg">
                        <span className="text-xs text-amber-400 font-semibold">NO ACTIVE SHIFT</span>
                    </div>
                )}

                {/* User Info Profile */}
                <div className="flex items-center space-x-3 border-l border-slate-700 pl-6">
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">{user ? user.username : 'Operator'}</p>
                        <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold">{user ? user.role : 'Staff'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">
                        {user ? user.username.charAt(0).toUpperCase() : 'O'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;