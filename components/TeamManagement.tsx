
import React, { useState } from 'react';
import { Team, TeamMember, User, UserRole } from '../types';

interface TeamManagementProps {
  teams: Team[];
  allUsers: User[];
  activeTeam: Team;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onAddTeam: (name: string) => void;
  onDeleteTeam: (teamId: string) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ 
  teams, 
  allUsers,
  activeTeam, 
  onUpdateTeam, 
  onAddTeam,
  onDeleteTeam
}) => {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  const totalCapacity = activeTeam.members.reduce((acc, m) => acc + (m.capacity * m.focusFactor), 0);
  const averageFocus = activeTeam.members.length > 0 
    ? (activeTeam.members.reduce((acc, m) => acc + m.focusFactor, 0) / activeTeam.members.length) * 100 
    : 0;

  const handleUpdateMember = (userId: string, updates: Partial<TeamMember>) => {
    const updatedMembers = activeTeam.members.map(m => 
      m.id === userId ? { ...m, ...updates } : m
    );
    onUpdateTeam(activeTeam.id, { members: updatedMembers });
  };

  const handleRemoveMember = (userId: string) => {
    const updatedMembers = activeTeam.members.filter(m => m.id !== userId);
    onUpdateTeam(activeTeam.id, { members: updatedMembers });
  };

  const handleAddMember = (user: User) => {
    const newMember: TeamMember = {
      ...user,
      capacity: 20, // Default capacity
      focusFactor: 1.0 // Default focus
    };
    onUpdateTeam(activeTeam.id, { members: [...activeTeam.members, newMember] });
    setIsMemberModalOpen(false);
  };

  const availableUsers = allUsers.filter(u => 
    !activeTeam.members.some(m => m.id === u.id) &&
    (u.name.toLowerCase().includes(memberSearch.toLowerCase()) || u.email.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div className="flex h-full space-x-8 animate-in fade-in duration-500">
      {/* Left: Team Selection Panel */}
      <div className="w-72 flex flex-col space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Teams</h3>
          <button 
            onClick={() => setIsAddingTeam(true)}
            className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        {isAddingTeam && (
          <div className="p-3 bg-white border border-indigo-200 rounded-xl shadow-sm space-y-2 animate-in slide-in-from-top-2">
            <input 
              autoFocus
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Team name..."
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newTeamName) {
                  onAddTeam(newTeamName);
                  setNewTeamName('');
                  setIsAddingTeam(false);
                }
                if (e.key === 'Escape') setIsAddingTeam(false);
              }}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAddingTeam(false)} className="text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
              <button onClick={() => { onAddTeam(newTeamName); setNewTeamName(''); setIsAddingTeam(false); }} className="text-[10px] font-bold text-indigo-600 uppercase">Create</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {teams.map(team => (
            <div 
              key={team.id}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${team.id === activeTeam.id ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold ${team.id === activeTeam.id ? 'text-white' : 'text-slate-900'}`}>{team.name}</h4>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${team.id === activeTeam.id ? 'bg-indigo-500 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  {team.members.length} members
                </div>
              </div>
              <p className={`text-xs ${team.id === activeTeam.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                {team.velocity} pts / sprint velocity
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Management Area */}
      <div className="flex-1 space-y-6 overflow-hidden flex flex-col">
        {/* Capacity Dashboard Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{activeTeam.name}</h2>
            <p className="text-slate-500 max-w-md">{activeTeam.description}</p>
          </div>
          
          <div className="flex space-x-8">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Capacity</p>
              <p className="text-3xl font-black text-indigo-600">{totalCapacity.toFixed(1)} <span className="text-sm text-slate-400">pts</span></p>
            </div>
            <div className="w-px h-12 bg-slate-100 my-auto" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Focus</p>
              <p className="text-3xl font-black text-slate-800">{Math.round(averageFocus)}%</p>
            </div>
          </div>
        </div>

        {/* Member Roster */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Team Roster</h3>
            <button 
              onClick={() => setIsMemberModalOpen(true)}
              className="text-xs font-bold text-indigo-600 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Add Member
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            <div className="grid grid-cols-[1fr_150px_100px_100px_100px] gap-4 px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 sticky top-0 z-10">
              <div>Member</div>
              <div>Role</div>
              <div className="text-center">Capacity</div>
              <div className="text-center">Focus %</div>
              <div className="text-right">Action</div>
            </div>

            {activeTeam.members.map(member => (
              <div key={member.id} className="grid grid-cols-[1fr_150px_100px_100px_100px] gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={member.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                  </div>
                </div>

                <div>
                  <select 
                    value={member.role}
                    onChange={e => handleUpdateMember(member.id, { role: e.target.value as UserRole })}
                    className="w-full px-2 py-1.5 text-xs font-bold border border-slate-100 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="flex justify-center">
                  <input 
                    type="number"
                    value={member.capacity}
                    onChange={e => handleUpdateMember(member.id, { capacity: Number(e.target.value) })}
                    className="w-16 px-2 py-1.5 text-center text-xs font-black border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-center">
                  <div className="relative w-16">
                    <input 
                      type="number"
                      step="10"
                      min="0"
                      max="100"
                      value={member.focusFactor * 100}
                      onChange={e => handleUpdateMember(member.id, { focusFactor: Number(e.target.value) / 100 })}
                      className="w-full px-2 py-1.5 text-center text-xs font-bold border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from Team"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}

            {activeTeam.members.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center opacity-40">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <h4 className="font-bold">No members in this team</h4>
                <p className="text-sm">Click "Add Member" to build your team.</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-indigo-50/30 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 font-medium italic">
              * Capacity is calculated as: <strong>Individual Capacity × Focus Factor</strong>. 
              The resulting team capacity determines the point threshold for your Sprint Board.
            </p>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900">Add Team Member</h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>

            <div className="p-6">
              <div className="relative mb-6">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                  placeholder="Search by name or email..."
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                />
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleAddMember(user)}
                    className="w-full flex items-center p-3 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 transition-all group text-left"
                  >
                    <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm mr-3" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-widest">{user.role}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 text-indigo-600 bg-white p-2 rounded-xl shadow-sm transition-all border border-indigo-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </div>
                  </button>
                ))}
                {availableUsers.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm font-bold text-slate-400 italic">No matching users available.</p>
                  </div>
                )}
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing users not in this team</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
