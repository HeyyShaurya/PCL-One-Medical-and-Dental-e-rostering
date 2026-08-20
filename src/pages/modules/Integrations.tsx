import { useState } from 'react';
import { useStore } from '../../store';

interface Integration {
  id: string;
  system: string;
  type: string;
  lastSync: string;
  status: 'Connected' | 'Pending' | 'Error';
}

const initial: Integration[] = [
  { id: 'i1', system: 'ESR (Electronic Staff Record)', type: 'Bi-directional HR feed', lastSync: '2 minutes ago', status: 'Connected' },
  { id: 'i2', system: 'LP2 \u2014 e-job planning', type: 'Job plan interface', lastSync: '18 minutes ago', status: 'Connected' },
  { id: 'i3', system: 'Agile Workforce (regional bank/locum)', type: 'Locum & temporary staffing', lastSync: '5 minutes ago', status: 'Connected' },
  { id: 'i4', system: 'Deanery link (via ESR)', type: 'Resident doctor rotations', lastSync: '1 hour ago', status: 'Connected' },
  { id: 'i5', system: 'KPI / data warehouse export', type: 'Reporting feed', lastSync: '10 minutes ago', status: 'Connected' },
  { id: 'i6', system: 'Payroll reconciliation', type: 'Finance', lastSync: 'Never', status: 'Pending' },
];

const TABS = ['Connected', 'Pending', 'Error'] as const;
type Tab = typeof TABS[number];

function chipClass(status: Integration['status']) {
  if (status === 'Connected') return 'status-green';
  if (status === 'Pending') return 'status-amber';
  return 'status-red';
}

export default function Integrations() {
  const { syncLog, simulateEsrNewStarter } = useStore();
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<Tab>('Connected');
  const [simulating, setSimulating] = useState(false);

  const visible = items.filter(i => i.status === tab);
  const retry = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Connected', lastSync: 'Just now' } : i));

  const runSim = () => {
    setSimulating(true);
    window.setTimeout(() => { simulateEsrNewStarter(); setSimulating(false); }, 900);
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Integration Hub</h1>
      <p className="text-sm text-pcl-muted -mt-1">Direct interfaces to the systems the Trusts already run \u2014 not a generic connector.</p>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Connected systems</span></div>
        <div className="pcl-tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>System</th><th>Type</th><th>Last sync</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(i => (
              <tr key={i.id}>
                <td>{i.system}</td>
                <td>{i.type}</td>
                <td>{i.lastSync}</td>
                <td><span className={chipClass(i.status)}>{i.status}</span></td>
                <td>
                  {i.status !== 'Connected' ? (
                    <button className="text-pcl-blue hover:underline" onClick={() => retry(i.id)}>Retry sync</button>
                  ) : <span className="text-pcl-muted">&mdash;</span>}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pcl-panel">
        <div className="pcl-panel-header">
          <span>ESR sync activity</span>
          <button className="btn-primary" onClick={runSim} disabled={simulating}>{simulating ? 'Syncing\u2026' : 'Simulate ESR new-starter feed'}</button>
        </div>
        <table className="pcl-table">
          <thead><tr><th>Time</th><th>Event</th><th>Detail</th><th>Direction</th></tr></thead>
          <tbody>
            {syncLog.map(s => (
              <tr key={s.id}>
                <td className="whitespace-nowrap">{s.time}</td>
                <td>{s.event}</td>
                <td className="text-pcl-muted">{s.detail}</td>
                <td className="whitespace-nowrap">{s.direction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
