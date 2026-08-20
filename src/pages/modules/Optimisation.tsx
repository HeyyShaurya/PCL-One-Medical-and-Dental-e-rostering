import { useState } from 'react';
import { useStore } from '../../store';

interface Suggestion {
  id: string;
  title: string;
  department: string;
  impact: string;
  status: 'New' | 'Applied' | 'Dismissed';
}

const initial: Suggestion[] = [
  { id: 's1', title: 'Redistribute 3 night shifts to reduce fatigue risk', department: 'Cardiology', impact: 'Improves rest-period margin', status: 'New' },
  { id: 's2', title: 'Swap two registrars to cut overtime', department: 'A&E', impact: '-6 hrs overtime/week', status: 'New' },
  { id: 's3', title: 'Rebalance weekend cover across the team', department: 'General Surgery', impact: '+2% fill rate', status: 'New' },
  { id: 's4', title: 'Consolidate bank shift bookings', department: 'Medicine', impact: 'Reduces agency reliance', status: 'Applied' },
  { id: 's5', title: 'Move on-call rotation to 1-in-6', department: 'Anaesthetics', impact: 'Improves compliance margin', status: 'Applied' },
  { id: 's6', title: 'Merge two under-filled Friday sessions', department: 'Radiology', impact: 'Minimal projected saving', status: 'Dismissed' },
];

const TABS = ['New suggestions', 'Applied', 'Dismissed'] as const;
type Tab = typeof TABS[number];

export default function Optimisation() {
  const { optimisationRun, runOptimisation } = useStore();
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<Tab>('New suggestions');

  const visible = items.filter(s =>
    tab === 'New suggestions' ? s.status === 'New' : tab === 'Applied' ? s.status === 'Applied' : s.status === 'Dismissed'
  );
  const setStatus = (id: string, status: Suggestion['status']) =>
    setItems(prev => prev.map(s => s.id === id ? { ...s, status } : s));

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Workforce Optimisation</h1>
      <p className="text-sm text-pcl-muted -mt-1">Runs against safe-staffing rules, EWTD/2016/2019 contract rules, LTFT patterns and staff preferences at once.</p>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Constraints applied to this rota block</span></div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><div className="text-xs uppercase tracking-wide text-pcl-muted mb-1">Contract rules</div>2016 + 2019 TCS <span className="status-green ml-1">On</span></div>
          <div><div className="text-xs uppercase tracking-wide text-pcl-muted mb-1">Working time</div>EWTD rest &amp; 48hr avg <span className="status-green ml-1">On</span></div>
          <div><div className="text-xs uppercase tracking-wide text-pcl-muted mb-1">Minimum staffing</div>Grade-mix floor <span className="status-green ml-1">On</span></div>
          <div><div className="text-xs uppercase tracking-wide text-pcl-muted mb-1">LTFT &amp; preferences</div>Weighted, not overriding <span className="status-green ml-1">On</span></div>
        </div>

        <div className="px-5 pb-5">
          <button className="btn-primary" onClick={runOptimisation} disabled={optimisationRun.status === 'running'}>
            {optimisationRun.status === 'running' ? 'Running optimisation\u2026' : 'Run optimisation'}
          </button>
        </div>

        {optimisationRun.status === 'running' && (
          <div className="px-5 pb-6 text-sm text-pcl-muted">Checking every open shift against contract rules, rest periods and staff preferences\u2026</div>
        )}

        {optimisationRun.status === 'done' && (
          <div className="border-t border-line px-5 py-5 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-[26px] font-light tabular-nums" style={{ color: 'var(--color-status-red)' }}>{optimisationRun.gapsBefore}</div>
              <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Gaps before</div>
            </div>
            <div className="text-center">
              <div className="text-[26px] font-light tabular-nums" style={{ color: 'var(--color-status-amber)' }}>{optimisationRun.gapsAfter}</div>
              <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Gaps after</div>
            </div>
            <div className="text-center">
              <div className="text-[26px] font-light tabular-nums" style={{ color: 'var(--color-status-green)' }}>{optimisationRun.fillRatePct}%</div>
              <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Vacancy fill rate</div>
            </div>
            {optimisationRun.remainingGaps.length > 0 && (
              <div className="col-span-3 text-sm border-t border-line pt-4 mt-1">
                <div className="font-semibold mb-1">Remaining gap</div>
                {optimisationRun.remainingGaps.map((g, i) => (
                  <div key={i} className="text-pcl-muted">{g.shift} \u2014 {g.reason}</div>
                ))}
              </div>
            )}
            <div className="col-span-3 text-sm border-t border-line pt-4 mt-1">
              <span className="status-green">Compliance</span>
              <span className="ml-2 text-pcl-muted">100% of newly generated shifts pass EWTD and 2016/2019 contract checks \u2014 nothing non-compliant was scheduled.</span>
            </div>
          </div>
        )}
      </div>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Suggestions</span></div>
        <div className="pcl-tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>Suggestion</th><th>Department</th><th>Projected impact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(s => (
              <tr key={s.id}>
                <td className="max-w-[320px]">{s.title}</td>
                <td>{s.department}</td>
                <td>{s.impact}</td>
                <td className="space-x-3">
                  {s.status === 'New' && (
                    <>
                      <button className="text-pcl-blue hover:underline" onClick={() => setStatus(s.id, 'Applied')}>Apply</button>
                      <button className="text-pcl-muted hover:underline" onClick={() => setStatus(s.id, 'Dismissed')}>Dismiss</button>
                    </>
                  )}
                  {s.status === 'Applied' && <span className="status-green">Applied</span>}
                  {s.status === 'Dismissed' && (
                    <button className="text-pcl-blue hover:underline" onClick={() => setStatus(s.id, 'New')}>Reconsider</button>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={4} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
