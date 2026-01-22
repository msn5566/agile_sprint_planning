
import React, { useState, useMemo } from 'react';
import { predictComplexity } from '../services/geminiService';
import { IssueType } from '../types';
import { Icons } from '../constants';

type POTab = 'maturity' | 'estimator' | 'analytics';

const TECH_STACK_OPTIONS = [
  'Modern Cloud Native (React/Node/Serverless)',
  'Legacy Enterprise (Java/Spring/Oracle)',
  'Mobile Native (iOS/Android/Swift)',
  'Data/ML Pipeline (Python/Spark/Airflow)',
  'Frontend Specialist (React/Tailwind/Next.js)',
  'Backend Specialist (Go/Rust/Postgres)',
  'Hybrid Desktop (Electron/C#)',
  'Embedded Systems (C++/IoT)'
];

export const POWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<POTab>('maturity');

  return (
    <div className="flex h-full flex-col space-y-6 animate-in fade-in duration-500">
      {/* Tab Navigation */}
      <div className="flex items-center space-x-8 border-b border-slate-200 px-2 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('maturity')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'maturity' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          1. Capability & Maturity
          {activeTab === 'maturity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
        <button 
          onClick={() => setActiveTab('estimator')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'estimator' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          2. Discovery Table
          {activeTab === 'estimator' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          3. Reporting & Analytics
          {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-10">
        {activeTab === 'maturity' && <ScreenMaturity />}
        {activeTab === 'estimator' && <ScreenEstimator />}
        {activeTab === 'analytics' && <ScreenAnalytics />}
      </div>
    </div>
  );
};

/* --- Screen 1: Engineering Maturity & Profile --- */
const ScreenMaturity = () => {
  const [metrics, setMetrics] = useState({
    juniorEng: 5,
    seniorEng: 3,
    offshoreLeverage: 40,
    aiAdoption: 30,
    regressionMaturity: 65,
    automationMaturity: 50,
    cicdMaturity: 75
  });

  const handleUpdate = (key: keyof typeof metrics, val: number) => {
    setMetrics(prev => ({ ...prev, [key]: val }));
  };

  const capacityScore = useMemo(() => {
    return (
      (metrics.seniorEng * 2.0) + 
      (metrics.juniorEng * 0.8) * 
      (metrics.aiAdoption / 100 + 1) * 
      (metrics.cicdMaturity / 100)
    ).toFixed(1);
  }, [metrics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
      <div className="lg:col-span-2 space-y-8">
        <MaturityCard title="Human Capital & Leverage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <MaturitySlider label="No of Junior Engineers" value={metrics.juniorEng} min={0} max={50} onChange={(v) => handleUpdate('juniorEng', v)} />
            <MaturitySlider label="No of Senior Engineers" value={metrics.seniorEng} min={0} max={30} onChange={(v) => handleUpdate('seniorEng', v)} />
            <div className="md:col-span-2">
              <MaturitySlider label="Offshore Leverage" value={metrics.offshoreLeverage} unit="%" onChange={(v) => handleUpdate('offshoreLeverage', v)} />
            </div>
          </div>
        </MaturityCard>

        <MaturityCard title="Engineering Capability maturity">
          <div className="space-y-8">
            <MaturitySlider label="Regression test maturity" value={metrics.regressionMaturity} unit="%" onChange={(v) => handleUpdate('regressionMaturity', v)} />
            <MaturitySlider label="Automation maturity" value={metrics.automationMaturity} unit="%" onChange={(v) => handleUpdate('automationMaturity', v)} />
            <MaturitySlider label="CI/CD maturity" value={metrics.cicdMaturity} unit="%" onChange={(v) => handleUpdate('cicdMaturity', v)} />
          </div>
        </MaturityCard>
      </div>

      <div className="space-y-8">
        <MaturityCard title="Strategic Modernization">
          <MaturitySlider label="% of AI Adoption" value={metrics.aiAdoption} unit="%" onChange={(v) => handleUpdate('aiAdoption', v)} />
        </MaturityCard>

        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-all" />
           <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 text-indigo-400">Capability Baseline</h4>
           <div className="flex items-baseline space-x-2 mb-4">
             <div className="text-6xl font-black">{capacityScore}</div>
             <div className="text-sm font-bold text-slate-500">Index</div>
           </div>
           <p className="text-xs text-slate-400 leading-relaxed">
             This index is a weighted multiplier used to calculate **Effort** in the Feature Estimator. High maturity in CI/CD and AI adoption significantly boosts this baseline.
           </p>
           <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Velocity Potential</span>
              <span className="text-xs font-black text-indigo-400">High</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const MaturityCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const MaturitySlider: React.FC<{ label: string; value: number; unit?: string; min?: number; max?: number; onChange: (v: number) => void }> = ({ 
  label, value, unit = '', min = 0, max = 100, onChange 
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-1">
      <span className="text-sm font-bold text-slate-700 tracking-tight">{label}</span>
      <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg">{value}{unit}</span>
    </div>
    <div className="relative h-6 flex items-center">
      <div className="absolute inset-0 h-1.5 my-auto bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-indigo-600 focus:outline-none z-10 opacity-0 md:opacity-100"
      />
    </div>
  </div>
);

/* --- Screen 2: Batch Feature Discovery Table --- */
interface EstimateItem {
  id: string;
  story: string;
  type: IssueType;
  technology: string;
  devComplexity: string;
  testComplexity: string;
  points: number;
  effort: number;
}

const ScreenEstimator = () => {
  const [items, setItems] = useState<EstimateItem[]>([
    {
      id: 'initial',
      story: '',
      type: IssueType.STORY,
      technology: TECH_STACK_OPTIONS[0],
      devComplexity: 'Medium',
      testComplexity: 'Low',
      points: 0,
      effort: 0
    }
  ]);
  const [isCalculating, setIsCalculating] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `story-${Date.now()}`,
        story: '',
        type: IssueType.STORY,
        technology: TECH_STACK_OPTIONS[0],
        devComplexity: 'Medium',
        testComplexity: 'Low',
        points: 0,
        effort: 0
      }
    ]);
  };

  const updateItem = (id: string, updates: Partial<EstimateItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      updateItem(id, { story: '', points: 0, effort: 0 });
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleBatchEstimate = async () => {
    setIsCalculating(true);
    const updatedItems = await Promise.all(items.map(async (item) => {
      if (!item.story) return item;
      try {
        const aiResult = await predictComplexity(
          item.story,
          `Type: ${item.type}. Stack: ${item.technology}. Dev: ${item.devComplexity}, Test: ${item.testComplexity}`
        );
        const points = aiResult.points || 5;
        return {
          ...item,
          points,
          effort: points * 6 
        };
      } catch (e) {
        return item;
      }
    }));
    setItems(updatedItems);
    setIsCalculating(false);
  };

  const totals = useMemo(() => {
    return items.reduce((acc, item) => ({
      points: acc.points + (item.points || 0),
      effort: acc.effort + (item.effort || 0)
    }), { points: 0, effort: 0 });
  }, [items]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-24">
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Discovery Workbench</h2>
          <p className="text-sm text-slate-400 mt-2 font-medium uppercase tracking-widest text-[10px]">Strategic Batch Sizing for Feature Portfolios</p>
        </div>
        <div className="flex items-center space-x-4">
           <button 
            onClick={addItem}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            Add Requirement
          </button>
          <button 
            onClick={handleBatchEstimate}
            disabled={isCalculating || items.every(i => !i.story)}
            className="px-8 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center space-x-2 disabled:opacity-50"
          >
            {isCalculating ? (
               <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            )}
            <span>Calculate Sizing</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Table Side */}
        <div className="xl:col-span-9 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-12 text-center">#</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement Detail</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-56">Stack</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-center">Dev</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-center">Test</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40 text-right">Estimate</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6 text-center">
                      <span className="text-xs font-black text-slate-300 group-hover:text-indigo-400 transition-colors">{index + 1}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select 
                          className="w-full px-4 py-2 pl-10 text-xs font-bold bg-slate-100/50 border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:outline-none transition-all cursor-pointer appearance-none"
                          value={item.type}
                          onChange={e => updateItem(item.id, { type: e.target.value as IssueType })}
                        >
                          {Object.values(IssueType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none scale-75">
                          {React.createElement(Icons[item.type as keyof typeof Icons] || Icons.Story)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <textarea 
                        rows={1}
                        className="w-full px-4 py-2 text-sm font-bold border-0 bg-transparent focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all resize-none placeholder:text-slate-200 placeholder:font-normal"
                        placeholder="e.g. As a user, I want to..."
                        value={item.story}
                        onChange={e => updateItem(item.id, { story: e.target.value })}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="w-full px-4 py-2 text-xs font-bold bg-slate-100/50 border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl focus:outline-none transition-all cursor-pointer appearance-none truncate"
                        value={item.technology}
                        onChange={e => updateItem(item.id, { technology: e.target.value })}
                      >
                        {TECH_STACK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select 
                        className="mx-auto px-2 py-1.5 text-[10px] font-black uppercase bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer"
                        value={item.devComplexity}
                        onChange={e => updateItem(item.id, { devComplexity: e.target.value })}
                      >
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select 
                        className="mx-auto px-2 py-1.5 text-[10px] font-black uppercase bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer"
                        value={item.testComplexity}
                        onChange={e => updateItem(item.id, { testComplexity: e.target.value })}
                      >
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {item.points > 0 ? (
                        <div className="flex items-center justify-end space-x-4 animate-in fade-in slide-in-from-right-4">
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Points</p>
                            <p className="text-lg font-black text-indigo-600 leading-none">{item.points}</p>
                          </div>
                          <div className="h-6 w-px bg-slate-100" />
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Effort</p>
                            <p className="text-lg font-black text-slate-900 leading-none">{item.effort}h</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end opacity-10">
                          <div className="w-12 h-1 bg-slate-200 rounded-full" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-200 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/30 border-t border-slate-50">
             <button 
              onClick={addItem}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center"
             >
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
               Insert Row
             </button>
          </div>
        </div>

        {/* Totals Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-indigo-400">Executive Sizing</h3>
             
             <div className="space-y-12">
               <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aggregate Score</p>
                 <div className="flex items-baseline space-x-2">
                   <div className="text-7xl font-black text-white">{totals.points}</div>
                   <div className="text-sm font-bold text-slate-600">pts</div>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Calculated Delivery Effort</p>
                 <div className="flex items-baseline space-x-2">
                   <div className="text-5xl font-black text-slate-100">{totals.effort}</div>
                   <div className="text-sm font-bold text-slate-600 uppercase">Hours</div>
                 </div>
               </div>
             </div>

             <div className="mt-12 pt-8 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Active Tech Profile</span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tight">Balanced</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Confidence Level</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">High (88%)</span>
                </div>
             </div>

             <div className="mt-10">
               <button 
                onClick={handleBatchEstimate}
                disabled={isCalculating || items.every(i => !i.story)}
                className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-50"
               >
                 {isCalculating ? 'Computing Portfolio...' : 'Export to Roadmap'}
               </button>
             </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Discovery Insight</h4>
             <p className="text-xs font-medium text-slate-600 leading-relaxed">
               Estimates are weighted against your **Capability Baseline Index**. Increasing your team's Automation maturity in Tab 1 will automatically reduce the Effort hours calculated here.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Screen 3: Reporting & Strategic Trends --- */
const ScreenAnalytics = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex items-end justify-between px-2">
         <div>
           <h2 className="text-2xl font-black text-slate-900">Portfolio Performance</h2>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-team strategic data</p>
         </div>
         <button className="px-6 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase rounded-full shadow-sm hover:shadow-md transition">Export Strategy Doc</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <AnalyticsCard title="Trend of stories" sub="Feature Discovery Velocity (Annual)">
           <TrendChart />
        </AnalyticsCard>
        <AnalyticsCard title="Trend of Data complexity" sub="Requirement Density per Epic">
           <DensityChart />
        </AnalyticsCard>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-30 group-hover:scale-110 transition-transform duration-700" />
        <div className="flex items-center justify-between mb-10 relative z-10">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Executive Dashboard</h3>
           <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Growth: +14.2%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <InsightMetric label="Release Stability Index" value="94.2%" trend="+2.1%" />
          <InsightMetric label="Planning Precision" value="88%" trend="+5.0%" />
          <InsightMetric label="Tech Debt Ceiling" value="12%" trend="-3.0%" />
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard: React.FC<{ title: string; sub: string; children: React.ReactNode }> = ({ title, sub, children }) => (
  <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm h-[450px] flex flex-col transition-all hover:ring-8 hover:ring-indigo-50/50">
    <div className="mb-10">
      <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">{title}</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{sub}</p>
    </div>
    <div className="flex-1 min-h-0 w-full relative">
      {children}
    </div>
  </div>
);

const InsightMetric: React.FC<{ label: string; value: string; trend: string }> = ({ label, value, trend }) => (
  <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
    <div className="flex items-end justify-between">
      <span className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</span>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{trend}</span>
    </div>
  </div>
);

const TrendChart = () => {
  const data = [12, 18, 14, 28, 32, 22, 28, 42, 38, 55, 48, 62];
  const width = 600;
  const height = 250;
  const pad = 30;

  const getX = (i: number) => (i / (data.length - 1)) * (width - 2 * pad) + pad;
  const getY = (v: number) => height - (v / 70) * (height - 2 * pad) - pad;

  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 0.15 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={`${path} L ${getX(data.length-1)} ${height-pad} L ${getX(0)} ${height-pad} Z`} fill="url(#trendGrad)" />
      <path d={path} fill="none" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={getX(i)} cy={getY(v)} r="5" fill="white" stroke="#4f46e5" strokeWidth="3" className="hover:scale-150 transition-transform cursor-pointer" />
      ))}
    </svg>
  );
};

const DensityChart = () => {
  const bars = [65, 45, 85, 55, 75, 95, 70, 90, 50, 80, 60, 85];
  return (
    <div className="flex items-end justify-between h-full space-x-3">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-slate-50 rounded-2xl relative group transition-all h-full" title={`Epic ${i+1}: ${h}% complexity`}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-indigo-500/20 rounded-2xl group-hover:bg-indigo-600 transition-all duration-700 shadow-sm" 
            style={{ height: `${h}%` }} 
          />
        </div>
      ))}
    </div>
  );
};
