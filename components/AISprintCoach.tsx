
import React, { useState } from 'react';
import { Sprint, Issue } from '../types';
import { getSprintAnalysis } from '../services/geminiService';

interface AISprintCoachProps {
  activeSprint: Sprint;
  issues: Issue[];
}

export const AISprintCoach: React.FC<AISprintCoachProps> = ({ activeSprint, issues }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    const result = await getSprintAnalysis(activeSprint, issues);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <svg className="w-5 h-5 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="font-black text-lg tracking-tight">AI Sprint Coach</h3>
          </div>
          {!analysis && !isLoading && (
            <button 
              onClick={runAnalysis}
              className="px-4 py-1.5 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Analyze Plan
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-8 space-y-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Consulting Gemini...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-indigo-100 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {analysis}
              </div>
            </div>
            <button 
              onClick={() => setAnalysis(null)}
              className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            >
              Clear Analysis
            </button>
          </div>
        ) : (
          <p className="text-indigo-100/80 text-sm leading-relaxed">
            Get instant AI feedback on your sprint goal, potential scope risks, and focus areas based on current task distribution.
          </p>
        )}
      </div>
    </div>
  );
};
