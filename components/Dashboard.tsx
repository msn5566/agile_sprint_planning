
import React from 'react';
import { Team, Sprint, Issue, IssueStatus } from '../types.ts';
import { AISprintCoach } from './AISprintCoach.tsx';

interface DashboardProps {
  team: Team;
  currentSprint?: Sprint;
  issues: Issue[];
  onNavigate: (view: 'dashboard' | 'backlog' | 'reports') => void;
  onCompleteSprint: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ team, currentSprint, issues, onNavigate, onCompleteSprint }) => {
  const sprintIssues = issues.filter(i => i.sprintId === currentSprint?.id);
  const totalPoints = sprintIssues.reduce((acc, i) => acc + i.storyPoints, 0);
  const completedPoints = sprintIssues
    .filter(i => i.status === IssueStatus.DONE)
    .reduce((acc, i) => acc + i.storyPoints, 0);
  
  const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Team Velocity" 
          value={team.velocity.toString()} 
          suffix="pts" 
          trend="+12%" 
          trendUp={true}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <MetricCard 
          label="Active Contributors" 
          value={team.members.length.toString()} 
          suffix="members" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <MetricCard 
          label="Open Issues" 
          value={issues.filter(i => i.status !== IssueStatus.DONE).length.toString()} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Sprint Progress Card */}
          {currentSprint ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Active Sprint</span>
                    <h2 className="text-2xl font-bold text-slate-900">{currentSprint.name}</h2>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sprint Goal</p>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50 rounded-r-lg">
                      "{currentSprint.goal}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-6 pt-4">
                     <button 
                      onClick={onCompleteSprint}
                      className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                    >
                      Complete Sprint
                    </button>
                    <button 
                      onClick={() => onNavigate('reports')}
                      className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                    >
                      Live Reports
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col items-center text-center space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={364} 
                        strokeDashoffset={364 - (364 * completionPercentage) / 100} 
                        strokeLinecap="round" 
                        className="text-indigo-600 transition-all duration-1000 ease-out" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-slate-900">{completionPercentage}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Complete</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{completedPoints} of {totalPoints} Points</p>
                    <p className="text-xs text-slate-500">Story points completed</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">No Active Sprint</h2>
                <p className="text-indigo-100">Ready to start planning? Drag issues into a new sprint to get moving.</p>
              </div>
              <button onClick={() => onNavigate('backlog')} className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                Plan New Sprint
              </button>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActionCard 
              title="Refine Backlog" 
              description="Prioritize issues and estimate story points."
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
              onClick={() => onNavigate('backlog')}
            />
            <QuickActionCard 
              title="Team Capacity" 
              description="Manage availability and individual member workloads."
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              onClick={() => {}}
            />
          </div>
        </div>

        <div className="space-y-8">
          {currentSprint && (
            <AISprintCoach activeSprint={currentSprint} issues={sprintIssues} />
          )}
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sprint Breakdown</h4>
            <div className="space-y-4">
              <BreakdownItem label="To Do" count={sprintIssues.filter(i => i.status === IssueStatus.TODO).length} color="bg-slate-200" />
              <BreakdownItem label="In Progress" count={sprintIssues.filter(i => i.status === IssueStatus.IN_PROGRESS).length} color="bg-indigo-500" />
              <BreakdownItem label="Done" count={sprintIssues.filter(i => i.status === IssueStatus.DONE).length} color="bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BreakdownItem: React.FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
    <span className="text-xs font-black text-slate-400">{count}</span>
  </div>
);

const MetricCard: React.FC<{ label: string; value: string; suffix?: string; trend?: string; trendUp?: boolean; icon: React.ReactNode }> = ({ 
  label, value, suffix, trend, trendUp, icon 
}) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-600">{icon}</div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-slate-900">
      {value}
      {suffix && <span className="text-sm font-medium text-slate-400 ml-1.5 uppercase">{suffix}</span>}
    </p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
  </div>
);

const QuickActionCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ 
  title, description, icon, onClick 
}) => (
  <button 
    onClick={onClick}
    className="text-left bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-indigo-500 hover:ring-4 hover:ring-indigo-50 transition-all group"
  >
    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors inline-block">
      {icon}
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-1">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </button>
);
