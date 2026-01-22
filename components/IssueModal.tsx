
import React, { useState, useEffect } from 'react';
import { Issue, IssueType, Priority, User, IssueStatus } from '../types';
import { Icons, MOCK_USERS } from '../constants';
import { predictComplexity } from '../services/geminiService';

interface IssueModalProps {
  issue?: Partial<Issue>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Issue>) => void;
}

export const IssueModal: React.FC<IssueModalProps> = ({ issue, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Issue>>({
    title: '',
    description: '',
    type: IssueType.STORY,
    priority: Priority.MEDIUM,
    storyPoints: 1,
    status: IssueStatus.BACKLOG,
    ...issue
  });

  const [isEstimating, setIsEstimating] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  useEffect(() => {
    if (issue) {
      setFormData({ 
        title: issue.title || '',
        description: issue.description || '',
        type: issue.type || IssueType.STORY,
        priority: issue.priority || Priority.MEDIUM,
        storyPoints: issue.storyPoints || 1,
        status: issue.status || IssueStatus.BACKLOG,
        ...issue 
      });
    }
  }, [issue, isOpen]);

  const handleAiEstimate = async () => {
    if (!formData.title) return;
    setIsEstimating(true);
    const result = await predictComplexity(formData.title || '', formData.description || '');
    setFormData(prev => ({ ...prev, storyPoints: result.points }));
    setAiReasoning(result.reasoning);
    setIsEstimating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {issue?.id ? `Edit ${issue.key}` : 'Create New User Story'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Title</label>
            <input 
              autoFocus
              className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Issue Type</label>
              <select 
                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as IssueType })}
              >
                {Object.values(IssueType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Priority</label>
              <select 
                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Story Points</label>
              <button 
                onClick={handleAiEstimate}
                disabled={isEstimating || !formData.title}
                className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 disabled:opacity-30 transition-all"
              >
                {isEstimating ? (
                  <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                )}
                AI Suggest
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 5, 8, 13].map(pts => (
                <button
                  key={pts}
                  onClick={() => {
                    setFormData({ ...formData, storyPoints: pts });
                    setAiReasoning(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    formData.storyPoints === pts 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                  }`}
                >
                  {pts}
                </button>
              ))}
            </div>
            {aiReasoning && (
              <p className="text-[10px] text-indigo-500 font-medium italic mt-2 animate-in fade-in slide-in-from-left-2">
                AI Insight: {aiReasoning}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              placeholder="Describe the functionality and acceptance criteria..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (formData.title) onSave(formData);
            }}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            {issue?.id ? 'Save Changes' : 'Create Issue'}
          </button>
        </footer>
      </div>
    </div>
  );
};
