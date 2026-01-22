
import React from 'react';
import { Issue, Team, Sprint, IssueType, Priority, UserRole } from '../types.ts';
import { IssueCard } from './IssueCard.tsx';

interface PlanningBoardProps {
  team: Team;
  sprint: Sprint;
  backlogIssues: Issue[];
  sprintIssues: Issue[];
  onMoveToSprint: (issueId: string) => void;
  onMoveToBacklog: (issueId: string) => void;
  isLocked: boolean;
  onLock: () => void;
}

export const PlanningBoard: React.FC<PlanningBoardProps> = ({
  team,
  sprint,
  backlogIssues,
  sprintIssues,
  onMoveToSprint,
  onMoveToBacklog,
  isLocked,
  onLock
}) => {
  const totalPoints = sprintIssues.reduce((acc, i) => acc + i.storyPoints, 0);
  const totalCapacity = team.members.reduce((acc, m) => acc + (m.capacity * m.focusFactor), 0);
  const percentage = Math.min((totalPoints / totalCapacity) * 100, 120);
  const isOverCapacity = totalPoints > totalCapacity;

  // Calculate per-member workload
  const memberWorkload = team.members.map(member => {
    const assignedPoints = sprintIssues
      .filter(i => i.assignee?.id === member.id)
      .reduce((acc, i) => acc + i.storyPoints, 0);
    const capacity = member.capacity * member.focusFactor;
    return {
      ...member,
      assignedPoints,
      capacity,
      pct: capacity > 0 ? (assignedPoints / capacity) * 100 : 0
    };
  });

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Top Planning Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{sprint.name}</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-widest">{sprint.startDate} — {sprint.endDate}</p>
          </div>
          
          <div className="h-10 w-px bg-slate-100" />

          {/* Capacity Tracker */}
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className={isOverCapacity ? 'text-red-500' : 'text-slate-400'}>Capacity {totalPoints} / {totalCapacity.toFixed(1)} pts</span>
              <span className={isOverCapacity ? 'text-red-500' : 'text-indigo-600'}>{Math.round((totalPoints/totalCapacity)*100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isOverCapacity ? 'bg-red-500 animate-pulse' : percentage > 90 ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isOverCapacity && (
            <div className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Adjust Scope
            </div>
          )}
          <button 
            onClick={onLock}
            disabled={isLocked}
            className={`flex items-center px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isLocked 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLocked ? (
              <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Sprint Locked</>
            ) : (
              <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg> Lock & Start Sprint</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex space-x-6 min-h-0 overflow-hidden">
        
        {/* Left Column: Product Backlog */}
        <div className="w-80 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Backlog</h3>
            <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded-full">{backlogIssues.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {backlogIssues.map(issue => (
              <div key={issue.id} className="relative group">
                <IssueCard issue={issue} canEdit={!isLocked} />
                {!isLocked && (
                  <button 
                    onClick={() => onMoveToSprint(issue.id)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white shadow-lg rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Sprint Planning */}
        <div className={`flex-1 flex flex-col rounded-2xl border transition-all ${isLocked ? 'bg-white border-slate-200' : 'bg-indigo-50/20 border-indigo-100 shadow-sm'} overflow-hidden`}>
          <div className="p-4 border-b border-indigo-100/50 bg-white flex items-center justify-between">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Sprint Contents</h3>
            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              {totalPoints} Committed Points
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {sprintIssues.map(issue => (
              <div key={issue.id} className="relative group">
                <IssueCard issue={issue} canEdit={!isLocked} />
                {!isLocked && (
                  <button 
                    onClick={() => onMoveToBacklog(issue.id)}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white text-slate-400 border border-slate-200 shadow-lg rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all z-20 hover:text-red-500 hover:scale-110 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Workload Monitor */}
        <div className="w-64 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Workload Balance</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {memberWorkload.map(m => (
              <div key={m.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={m.avatar} className="w-6 h-6 rounded-full" alt="" />
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{m.name}</span>
                  </div>
                  <span className={`text-[10px] font-black ${m.pct > 100 ? 'text-red-600' : 'text-slate-400'}`}>
                    {m.assignedPoints} / {m.capacity.toFixed(0)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className={`h-full transition-all duration-700 ${m.pct > 100 ? 'bg-red-500' : m.pct > 80 ? 'bg-orange-400' : 'bg-indigo-500'}`}
                    style={{ width: `${Math.min(m.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
