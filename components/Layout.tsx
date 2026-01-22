
import React from 'react';
import { User, UserRole, Team } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeUser: User;
  onUserChange: (user: User) => void;
  users: User[];
  activeTeam: Team;
  onTeamChange: (team: Team) => void;
  teams: Team[];
  activeView: 'dashboard' | 'backlog' | 'teams' | 'reports' | 'po_workspace';
  onNavigate: (view: 'dashboard' | 'backlog' | 'teams' | 'reports' | 'po_workspace') => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeUser, 
  onUserChange, 
  users,
  activeTeam,
  onTeamChange,
  teams,
  activeView,
  onNavigate
}) => {
  return (
    <div className="flex h-screen overflow-hidden text-slate-900 bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">A</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">AgileFlow</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <div className="mb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Workspace</label>
            <div className="mt-1 relative">
              <select 
                value={activeTeam.id}
                onChange={(e) => {
                  const team = teams.find(t => t.id === e.target.value);
                  if (team) onTeamChange(team);
                }}
                className="w-full pl-3 pr-10 py-2.5 text-sm font-semibold border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          
          <button 
            onClick={() => onNavigate('backlog')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeView === 'backlog' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Backlog
          </button>

          <button 
            onClick={() => onNavigate('po_workspace')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeView === 'po_workspace' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            PO Workspace
          </button>

          <button 
            onClick={() => onNavigate('teams')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeView === 'teams' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Team & Capacity
          </button>

          <button 
            onClick={() => onNavigate('reports')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeView === 'reports' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Sprint Reports
          </button>
        </nav>

        {/* User Switcher (for demo/role testing) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-2 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Active Role: {activeUser.role}</p>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer transition-all relative group">
            <img src={activeUser.avatar} className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm" alt="" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-900">{activeUser.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">{activeUser.email}</p>
            </div>
            <div className="absolute bottom-full left-0 mb-3 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl hidden group-hover:block z-50 overflow-hidden">
              <p className="p-4 text-[10px] font-bold text-slate-400 border-b bg-slate-50 uppercase tracking-widest">Switch User Persona</p>
              <div className="max-h-64 overflow-y-auto">
                {users.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => onUserChange(u)}
                    className="w-full flex items-center p-4 text-left hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100"
                  >
                    <img src={u.avatar} className="w-8 h-8 rounded-full mr-3 shadow-sm border border-slate-100" alt="" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] font-medium text-indigo-600">{u.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              {activeView === 'dashboard' ? 'Team Overview' : 
               activeView === 'backlog' ? 'Backlog Management' : 
               activeView === 'teams' ? 'Team & Capacity' :
               activeView === 'po_workspace' ? 'PO Strategy Workspace' :
               'Sprint Analytics'}
            </h1>
            <span className="text-slate-300">/</span>
            <div className="flex -space-x-1.5">
              {activeTeam.members.slice(0, 4).map(m => (
                <img key={m.id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" title={m.name} alt="" />
              ))}
              {activeTeam.members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                  +{activeTeam.members.length - 4}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              New Issue
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {children}
        </section>
      </main>
    </div>
  );
};
