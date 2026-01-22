
import React, { useState, useMemo } from 'react';
import { Issue, IssueStatus, Priority, User, IssueType } from '../types';
import { Icons } from '../constants';
import { IssueCard } from './IssueCard';
import { IssueModal } from './IssueModal';

interface BacklogManagerProps {
  issues: Issue[];
  onUpdateIssue: (issueId: string, updates: Partial<Issue>) => void;
  onDeleteIssues: (issueIds: string[]) => void;
  onCreateIssue: (data: Partial<Issue>) => void;
  onMoveToSprint: (issueIds: string[]) => void;
  canEdit: boolean;
}

export const BacklogManager: React.FC<BacklogManagerProps> = ({ 
  issues, 
  onUpdateIssue, 
  onDeleteIssues, 
  onCreateIssue,
  onMoveToSprint,
  canEdit 
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Partial<Issue> | undefined>(undefined);

  // Filtered Logic
  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.key.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || i.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [issues, search, priorityFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredIssues.length && filteredIssues.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIssues.map(i => i.id));
    }
  };

  const handleEditClick = (issue: Issue) => {
    setEditingIssue(issue);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Partial<Issue>) => {
    if (editingIssue?.id) {
      onUpdateIssue(editingIssue.id, data);
    } else {
      onCreateIssue(data);
    }
    setIsModalOpen(false);
    setEditingIssue(undefined);
  };

  return (
    <div className="space-y-6 relative pb-24 animate-in fade-in duration-500">
      {/* Filtering & Actions Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center flex-1 space-x-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search across backlog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium placeholder-slate-400"
            />
          </div>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-100 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-100 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <button 
          onClick={() => {
            setEditingIssue(undefined);
            setIsModalOpen(true);
          }}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          New User Story
        </button>
      </div>

      {/* Backlog List (Hybrid Table) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[48px_100px_1fr_80px_120px_120px_100px_80px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest items-center">
          <div className="flex justify-center">
            <input 
              type="checkbox" 
              checked={selectedIds.length > 0 && selectedIds.length === filteredIssues.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <div>Key</div>
          <div>Title</div>
          <div className="text-center">Points</div>
          <div>Priority</div>
          <div>Status</div>
          <div className="text-right">Assignee</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100 max-h-[calc(100vh-320px)] overflow-y-auto">
          {filteredIssues.map(issue => (
            <div 
              key={issue.id} 
              className={`grid grid-cols-[48px_100px_1fr_80px_120px_120px_100px_80px] gap-4 px-6 py-4 hover:bg-indigo-50/20 transition-all items-center group relative border-l-4 border-transparent ${selectedIds.includes(issue.id) ? 'bg-indigo-50/50 border-indigo-500' : ''}`}
            >
              <div className="flex justify-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(issue.id)}
                  onChange={() => toggleSelect(issue.id)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <div className="text-xs font-bold text-slate-400 tracking-tighter">{issue.key}</div>
              <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => handleEditClick(issue)}>
                <div className="scale-75 flex-shrink-0"><IconForType type={issue.type} /></div>
                <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition-colors" title={issue.title}>{issue.title}</span>
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    const points = [1, 2, 3, 5, 8, 13];
                    const currentIndex = points.indexOf(issue.storyPoints);
                    const nextIndex = (currentIndex + 1) % points.length;
                    onUpdateIssue(issue.id, { storyPoints: points[nextIndex] });
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
                  title="Click to cycle Fibonacci points"
                >
                  {issue.storyPoints}
                </button>
              </div>
              <div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shadow-sm uppercase ${getPriorityStyle(issue.priority)}`}>
                  {issue.priority}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">
                  {issue.status}
                </span>
              </div>
              <div className="flex justify-end">
                {issue.assignee ? (
                  <img src={issue.assignee.avatar} className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100" title={issue.assignee.name} alt="" />
                ) : (
                  <div className="w-7 h-7 rounded-full border border-dashed border-slate-300 bg-slate-50 group-hover:bg-white transition-colors flex items-center justify-center text-[10px] text-slate-300 font-bold" title="No assignee">?</div>
                )}
              </div>
              <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(issue)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Issue"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button 
                  onClick={() => onDeleteIssues([issue.id])}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Issue"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {filteredIssues.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-slate-900 font-bold">No results found</h4>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSearch(''); setPriorityFilter('All'); setStatusFilter('All'); }}
                className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-slate-800 flex items-center space-x-8 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
          <div className="flex items-center space-x-3 pr-8 border-r border-slate-700">
            <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">
              {selectedIds.length}
            </span>
            <span className="text-sm font-bold text-slate-300 tracking-tight">Items Selected</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => {
                onMoveToSprint(selectedIds);
                setSelectedIds([]);
              }}
              className="flex items-center text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              Plan for Sprint
            </button>
            <button className="flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors group">
              <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Update Status
            </button>
            <button 
              onClick={() => {
                onDeleteIssues(selectedIds);
                setSelectedIds([]);
              }}
              className="flex items-center text-xs font-bold text-red-400 hover:text-red-300 transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete Bulk
            </button>
          </div>

          <button 
            onClick={() => setSelectedIds([])}
            className="ml-4 p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <IssueModal 
        isOpen={isModalOpen}
        issue={editingIssue}
        onClose={() => { setIsModalOpen(false); setEditingIssue(undefined); }}
        onSave={handleSaveModal}
      />
    </div>
  );
};

const IconForType: React.FC<{ type: string }> = ({ type }) => {
  const Icon = Icons[type as keyof typeof Icons] || Icons.Story;
  return <Icon />;
};

const getPriorityStyle = (p: Priority) => {
  switch(p) {
    case Priority.CRITICAL: return 'bg-red-50 text-red-600 border-red-100';
    case Priority.HIGH: return 'bg-orange-50 text-orange-600 border-orange-100';
    case Priority.MEDIUM: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    default: return 'bg-slate-50 text-slate-400 border-slate-100';
  }
};
