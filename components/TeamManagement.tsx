
import React, { useState } from 'react';
import { Team, TeamMember, User, UserRole } from '../types.ts';
import { UserModal } from './UserModal.tsx';

interface TeamManagementProps {
  teams: Team[];
  allUsers: User[];
  activeTeam: Team;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onAddTeam: (name: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onUpdateGlobalUser: (userId: string, updates: Partial<User>) => void;
  onAddGlobalUser: (userData: Partial<User>) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ 
  teams, 
  allUsers,
  activeTeam, 
  onUpdateTeam, 
  onAddTeam,
  onDeleteTeam,
  onUpdateGlobalUser,
  onAddGlobalUser
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'directory'>('teams');
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
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
      capacity: 20,
      focusFactor: 1.0
    };
    onUpdateTeam(activeTeam.id, { members: [...activeTeam.members, newMember] });
    setIsMemberModalOpen(false);
  };

  const availableUsers = allUsers.filter(u => 
    !activeTeam.members.some(m => m.id === u.id) &&
    (u.name.toLowerCase().includes(memberSearch.toLowerCase()) || u.email.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div className="flex h-full flex-col space-y-6 animate-in fade-in duration-500">
      {/* Top Navigation Tabs */}
      <div className="flex items-center space-x-8 border-b border-slate-200 px-2 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('teams')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'teams' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Teams & Rosters
          {activeTab === 'teams' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
        <button 
          onClick={() => setActiveTab('directory')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'directory' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Global People Directory
          {activeTab === 'directory' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden space-x-8">
        {activeTab === 'teams' ? (
          <>
            {/* Left: Team Selection Panel */}
            <div className="w-72 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Teams</h3>
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

              <div className="space-y-2 overflow-y-auto pr-1">
                {teams.map(team => (
                  <div 
                    key={team.id}
                    onClick={() => onUpdateTeam(team.id, {})} // Trigger selection in parent via any update
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${team.id === activeTeam.id ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-bold ${team.id === activeTeam.id ? 'text-white' : 'text-slate-900'}`}>{team.name}</h4>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${team.id === activeTeam.id ? 'bg-indigo-500 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                        {team.members.length}
                      </div>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-tight ${team.id === activeTeam.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                      Velocity: {team.velocity} pts
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Team Roster Area */}
            <div className="flex-1 flex flex-col space-y-6 min-h-0">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{activeTeam.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">{activeTeam.description}</p>
                </div>
                <div className="flex space-x-6 text-right">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                    <p className="text-xl font-black text-indigo-600">{totalCapacity.toFixed(1)}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100 my-auto" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Focus</p>
                    <p className="text-xl font-black text-slate-800">{Math.round(averageFocus)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Roster</h3>
                  <button onClick={() => setIsMemberModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100">
                    Add Member
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                   <div className="grid grid-cols-[1fr_150px_100px_100px_80px] gap-4 px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 sticky top-0 z-10">
                    <div>Member</div>
                    <div>Role</div>
                    <div className="text-center">Capacity</div>
                    <div className="text-center">Focus %</div>
                    <div className="text-right">Action</div>
                  </div>
                  {activeTeam.members.map(member => (
                    <div key={member.id} className="grid grid-cols-[1fr_150px_100px_100px_80px] gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img src={member.avatar} className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" alt="" />
                        <div className="truncate">
                          <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-600">{member.role}</div>
                      <div className="flex justify-center">
                        <input type="number" value={member.capacity} onChange={e => handleUpdateMember(member.id, { capacity: Number(e.target.value) })} className="w-16 px-2 py-1 text-center text-xs font-black border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="flex justify-center">
                        <input type="number" step="10" value={member.focusFactor * 100} onChange={e => handleUpdateMember(member.id, { focusFactor: Number(e.target.value) / 100 })} className="w-16 px-2 py-1 text-center text-xs font-bold border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => handleRemoveMember(member.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Directory View */
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <header className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Organization Directory</h2>
                <p className="text-xs text-slate-500">Master list of all users available in AgileFlow workspace.</p>
              </div>
              <button 
                onClick={() => { setEditingUser(undefined); setIsUserModalOpen(true); }}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition"
              >
                Create New User
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white shadow-sm z-20">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Default Role</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                          <span className="text-sm font-bold text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500 font-medium">{user.email}</td>
                      <td className="px-8 py-4 text-center">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${
                          user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          user.role === UserRole.SCRUM_MASTER ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button 
                          onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }}
                          className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Team Member Picker Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900">Add to Team</h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            <div className="p-6">
              <input 
                className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
                placeholder="Search users..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {availableUsers.map(user => (
                  <button key={user.id} onClick={() => handleAddMember(user)} className="w-full flex items-center p-3 rounded-2xl hover:bg-indigo-50 text-left transition-colors">
                    <img src={user.avatar} className="w-9 h-9 rounded-full mr-3 shadow-sm" alt="" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate uppercase tracking-widest">{user.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global User Creator/Editor Modal */}
      <UserModal 
        isOpen={isUserModalOpen}
        user={editingUser}
        onClose={() => { setIsUserModalOpen(false); setEditingUser(undefined); }}
        onSave={(data) => {
          if (editingUser) onUpdateGlobalUser(editingUser.id, data);
          else onAddGlobalUser(data);
          setIsUserModalOpen(false);
        }}
      />
    </div>
  );
};
