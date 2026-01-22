
import React, { useState } from 'react';
import { predictComplexity } from '../services/geminiService';

type POTab = 'maturity' | 'estimator' | 'analytics';

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
          Engineering Maturity
          {activeTab === 'maturity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
        <button 
          onClick={() => setActiveTab('estimator')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'estimator' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Story Strategy Estimator
          {activeTab === 'estimator' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Trends & Forecasts
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

/* --- Screen 1: Maturity --- */
const ScreenMaturity = () => {
  const [metrics, setMetrics] = useState({
    juniorEng: 4,
    seniorEng: 2,
    offshoreLeverage: 60,
    aiAdoption: 45,
    regressionMaturity: 70,
    automationMaturity: 55,
    cicdMaturity: 85
  });

  const handleUpdate = (key: keyof typeof metrics, val: number) => {
    setMetrics(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <MaturityCard title="Headcount & Leverage">
          <MaturitySlider label="No of Junior Engineers" value={metrics.juniorEng} min={0} max={20} onChange={(v) => handleUpdate('juniorEng', v)} />
          <MaturitySlider label="No of Senior Engineers" value={metrics.seniorEng} min={0} max={20} onChange={(v) => handleUpdate('seniorEng', v)} />
          <MaturitySlider label="Offshore Leverage (%)" value={metrics.offshoreLeverage} unit="%" onChange={(v) => handleUpdate('offshoreLeverage', v)} />
        </MaturityCard>

        <MaturityCard title="Modernization">
          <MaturitySlider label="% of AI Adoption" value={metrics.aiAdoption} unit="%" onChange={(v) => handleUpdate('aiAdoption', v)} />
        </MaturityCard>
      </div>

      <div className="space-y-6">
        <MaturityCard title="Engineering Pipeline Maturity">
          <MaturitySlider label="Regression test maturity (%)" value={metrics.regressionMaturity} unit="%" onChange={(v) => handleUpdate('regressionMaturity', v)} />
          <MaturitySlider label="Automation maturity (%)" value={metrics.automationMaturity} unit="%" onChange={(v) => handleUpdate('automationMaturity', v)} />
          <MaturitySlider label="CI/CD maturity (%)" value={metrics.cicdMaturity} unit="%" onChange={(v) => handleUpdate('cicdMaturity', v)} />
        </MaturityCard>
        
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl">
           <h4 className="text-sm font-black uppercase tracking-widest mb-4 opacity-70">Team Capacity Score</h4>
           <div className="text-5xl font-black mb-2">{(metrics.juniorEng * 0.5 + metrics.seniorEng * 1.5 + (metrics.aiAdoption/100)).toFixed(1)}</div>
           <p className="text-xs text-indigo-100 opacity-80 leading-relaxed">Based on your maturity and headcount modeling, this is the estimated relative capacity multiplier for your workspace.</p>
        </div>
      </div>
    </div>
  );
};

const MaturityCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="p-6 space-y-8">
      {children}
    </div>
  </div>
);

const MaturitySlider: React.FC<{ label: string; value: number; unit?: string; min?: number; max?: number; onChange: (v: number) => void }> = ({ 
  label, value, unit = '', min = 0, max = 100, onChange 
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-100">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

/* --- Screen 2: Estimator --- */
const ScreenEstimator = () => {
  const [story, setStory] = useState('');
  const [tech, setTech] = useState('React, Node.js');
  const [devComplexity, setDevComplexity] = useState('Medium');
  const [testComplexity, setTestComplexity] = useState('Low');
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState({ points: 0, effort: 0 });

  const handleEstimate = async () => {
    if (!story) return;
    setIsCalculating(true);
    // Simulating call to Gemini or logical calculation based on inputs
    const complexityMap: any = { 'Low': 1, 'Medium': 3, 'High': 8 };
    const dev = complexityMap[devComplexity] || 3;
    const test = complexityMap[testComplexity] || 1;
    
    // AI enhanced prediction logic
    const aiResult = await predictComplexity(story, `Tech: ${tech}. Dev Complexity: ${devComplexity}, Test Complexity: ${testComplexity}`);
    
    setResults({
      points: aiResult.points || (dev + test),
      effort: (dev + test) * 4 // Simple heuristic: 4 hours per point
    });
    setIsCalculating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 h-[500px]">
          <div className="md:col-span-3 p-10 space-y-6">
            <h2 className="text-2xl font-black text-slate-900">PO Refinement Desk</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Story Title / Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-5 py-3 text-sm font-bold border border-slate-100 bg-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                  placeholder="As a user, I want to..."
                  value={story}
                  onChange={e => setStory(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Technology Stack</label>
                <input 
                  className="w-full px-5 py-3 text-sm font-bold border border-slate-100 bg-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  value={tech}
                  onChange={e => setTech(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dev Complexity</label>
                  <select 
                    className="w-full px-4 py-3 text-sm font-bold border border-slate-100 bg-slate-50 rounded-2xl focus:outline-none"
                    value={devComplexity}
                    onChange={e => setDevComplexity(e.target.value)}
                  >
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Test Complexity</label>
                  <select 
                    className="w-full px-4 py-3 text-sm font-bold border border-slate-100 bg-slate-50 rounded-2xl focus:outline-none"
                    value={testComplexity}
                    onChange={e => setTestComplexity(e.target.value)}
                  >
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={handleEstimate}
              disabled={isCalculating || !story}
              className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50"
            >
              {isCalculating ? 'Computing strategy...' : 'Calculate Strategy'}
            </button>
          </div>

          <div className="md:col-span-2 bg-slate-50 border-l border-slate-100 p-10 flex flex-col items-center justify-center text-center space-y-10 relative">
             {results.points > 0 ? (
               <>
                 <div className="space-y-2 group">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Story Points</p>
                   <div className="text-8xl font-black text-indigo-600 group-hover:scale-110 transition-transform">{results.points}</div>
                 </div>
                 <div className="space-y-2 group">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Effort</p>
                   <div className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform">{results.effort} <span className="text-sm text-slate-400">hours</span></div>
                 </div>
               </>
             ) : (
               <div className="space-y-4 opacity-40">
                  <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Waiting for Strategy Inputs</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Screen 3: Analytics --- */
const ScreenAnalytics = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsCard title="Story Volume Trend" sub="Trailing 12 Months">
           <TrendChart />
        </AnalyticsCard>
        <AnalyticsCard title="Data Density Trend" sub="Attribute complexity per story">
           <DensityChart />
        </AnalyticsCard>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Key Insights</h3>
           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase">Trend: Positive</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InsightMetric label="Release Stability" value="94.2%" trend="+2.1%" />
          <InsightMetric label="Planning Accuracy" value="88%" trend="+5.0%" />
          <InsightMetric label="Tech Debt Ratio" value="12%" trend="-3.0%" />
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard: React.FC<{ title: string; sub: string; children: React.ReactNode }> = ({ title, sub, children }) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-[400px] flex flex-col">
    <div className="mb-8">
      <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{title}</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
    </div>
    <div className="flex-1 min-h-0 w-full relative">
      {children}
    </div>
  </div>
);

const InsightMetric: React.FC<{ label: string; value: string; trend: string }> = ({ label, value, trend }) => (
  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</span>
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{trend}</span>
    </div>
  </div>
);

const TrendChart = () => {
  const data = [10, 15, 8, 20, 25, 18, 22, 30, 28, 35, 32, 40];
  const width = 500;
  const height = 200;
  const pad = 20;

  const getX = (i: number) => (i / (data.length - 1)) * (width - 2 * pad) + pad;
  const getY = (v: number) => height - (v / 40) * (height - 2 * pad) - pad;

  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={`${path} L ${getX(data.length-1)} ${height-pad} L ${getX(0)} ${height-pad} Z`} fill="url(#grad)" />
      <path d={path} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={getX(i)} cy={getY(v)} r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />
      ))}
    </svg>
  );
};

const DensityChart = () => {
  const bars = [60, 40, 80, 50, 70, 90, 65, 85, 45, 75];
  return (
    <div className="flex items-end justify-between h-full space-x-2">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group transition-all" style={{ height: `${h}%` }}>
          <div className="absolute inset-0 bg-indigo-500 rounded-t-lg scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500" />
        </div>
      ))}
    </div>
  );
};
