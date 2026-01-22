
import React, { useState } from 'react';
import { Team, Sprint, Issue, IssueStatus } from '../types';

interface SprintReportsProps {
  team: Team;
  issues: Issue[];
}

export const SprintReports: React.FC<SprintReportsProps> = ({ team, issues }) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(team.sprints[0]?.id || '');
  const [isExporting, setIsExporting] = useState(false);

  const selectedSprint = team.sprints.find(s => s.id === selectedSprintId);
  const sprintIssues = issues.filter(i => i.sprintId === selectedSprintId);
  
  const totalPoints = sprintIssues.reduce((acc, i) => acc + i.storyPoints, 0);
  const completedPoints = sprintIssues
    .filter(i => i.status === IssueStatus.DONE)
    .reduce((acc, i) => acc + i.storyPoints, 0);
  
  const accuracy = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const handleExport = (format: 'PDF' | 'CSV') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Sprint report successfully exported as ${format}`);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            {team.sprints.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
            ))}
          </select>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            Analytics Live
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            disabled={isExporting}
            onClick={() => handleExport('CSV')}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export CSV
          </button>
          <button 
            disabled={isExporting}
            onClick={() => handleExport('PDF')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all flex items-center shadow-lg disabled:opacity-50"
          >
            {isExporting ? (
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            )}
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Commitment Accuracy" value={`${accuracy}%`} sub="Target vs. Completed" trend="+4%" trendUp={true} />
        <KPICard title="Sprint Velocity" value={`${completedPoints} pts`} sub="Final delivered points" trend="-2 pts" trendUp={false} />
        <KPICard title="Scope Creep" value="8%" sub="Added after kickoff" trend="+2%" trendUp={false} />
        <KPICard title="Team Happiness" value="4.8/5" sub="Post-sprint retro avg" trend="Stable" trendUp={true} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Burndown Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Sprint Burndown</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Remaining work vs. time</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase">
                <span className="w-3 h-0.5 bg-slate-300 border-dashed border" />
                <span>Ideal</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-600 uppercase">
                <span className="w-3 h-0.5 bg-indigo-600" />
                <span>Actual</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] relative">
            <BurndownSVG points={totalPoints} current={completedPoints} />
          </div>
        </div>

        {/* Commitment vs Velocity */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 leading-tight">Velocity History</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Commitment vs. Reality</p>
          </div>
          <div className="flex-1 space-y-6">
            <VelocityBar label="Sprint 23" planned={24} actual={22} />
            <VelocityBar label="Sprint 22" planned={20} actual={20} />
            <VelocityBar label="Sprint 21" planned={22} actual={18} />
            <VelocityBar label="Sprint 20" planned={18} actual={21} />
            <VelocityBar label="Sprint 19" planned={24} actual={15} />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Planned</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string, value: string, sub: string, trend: string, trendUp: boolean }> = ({ title, value, sub, trend, trendUp }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">{title}</p>
    <div className="flex items-end justify-between">
      <div>
        <h4 className="text-2xl font-black text-slate-900">{value}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-lg ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trendUp ? (
          <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        ) : (
          <svg className="w-3 h-3 mr-0.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        )}
        {trend}
      </div>
    </div>
  </div>
);

const BurndownSVG: React.FC<{ points: number, current: number }> = ({ points, current }) => {
  // Simple simulation of 10 days
  const days = 10;
  const idealStep = points / days;
  const idealPoints = Array.from({ length: days + 1 }, (_, i) => points - i * idealStep);
  
  // Real progress simulation
  const actualPoints = [points, points - 2, points - 3, points - 8, points - 8, points - 12, points - 15]; // Current day 6
  
  const width = 800;
  const height = 300;
  const pad = 40;

  const getX = (i: number) => (i / days) * (width - 2 * pad) + pad;
  const getY = (val: number) => height - (val / points) * (height - 2 * pad) - pad;

  const idealPath = idealPoints.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ');
  const actualPath = actualPoints.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      {/* Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <line 
          key={pct} 
          x1={pad} y1={getY(points * pct)} x2={width - pad} y2={getY(points * pct)} 
          stroke="#f1f5f9" strokeWidth="1" 
        />
      ))}

      {/* Ideal Path */}
      <path d={idealPath} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
      
      {/* Actual Path */}
      <path d={actualPath} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Actual Nodes */}
      {actualPoints.map((val, i) => (
        <circle key={i} cx={getX(i)} cy={getY(val)} r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />
      ))}

      {/* Labels */}
      <text x={pad - 10} y={getY(points)} textAnchor="end" className="text-[10px] font-bold fill-slate-400">Pts</text>
      <text x={width - pad} y={height - 10} textAnchor="end" className="text-[10px] font-bold fill-slate-400 uppercase tracking-widest">End Sprint</text>
    </svg>
  );
};

const VelocityBar: React.FC<{ label: string, planned: number, actual: number }> = ({ label, planned, actual }) => {
  const max = 30;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <span className="text-[10px] font-black text-slate-400">{actual} / {planned} pts</span>
      </div>
      <div className="h-4 w-full bg-slate-50 rounded-full flex overflow-hidden border border-slate-100 p-0.5">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
          style={{ width: `${(actual / max) * 100}%` }}
        />
        <div 
          className="h-full bg-slate-200 opacity-50 ml-0.5 rounded-full transition-all duration-1000"
          style={{ width: `${((planned - actual) / max) * 100}%` }}
        />
      </div>
    </div>
  );
};
