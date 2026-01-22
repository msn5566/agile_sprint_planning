
import React from 'react';
// Fixed: Issue and Priority are exported from types.ts, but Icons is exported from constants.tsx
import { Issue, Priority } from '../types';
import { Icons } from '../constants';

interface IssueCardProps {
  issue: Issue;
  onSelect?: (issue: Issue) => void;
  canEdit?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onSelect, canEdit = true }) => {
  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.CRITICAL: return 'text-red-600';
      case Priority.HIGH: return 'text-orange-600';
      case Priority.MEDIUM: return 'text-yellow-600';
      default: return 'text-slate-400';
    }
  };

  const TypeIcon = Icons[issue.type as keyof typeof Icons] || Icons.Story;

  return (
    <div 
      className={`group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all ${!canEdit && 'opacity-70 cursor-not-allowed'}`}
      onClick={() => onSelect?.(issue)}
    >
      <div className="flex items-center space-x-3 flex-1 overflow-hidden">
        <TypeIcon />
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{issue.key}</span>
        <p className="text-sm font-medium text-slate-800 truncate">{issue.title}</p>
      </div>
      
      <div className="flex items-center space-x-4 ml-4">
        <span className={`text-xs font-bold ${getPriorityColor(issue.priority)}`}>
          {issue.priority[0]}
        </span>
        <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">
          {issue.storyPoints}
        </div>
        {issue.assignee ? (
          <img src={issue.assignee.avatar} className="w-6 h-6 rounded-full" alt="" />
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 bg-slate-50" />
        )}
      </div>
    </div>
  );
};
