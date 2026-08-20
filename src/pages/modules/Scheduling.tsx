import { useState } from 'react';
import Modal from '../../components/Modal';

interface Rota {
  id: string;
  period: string;
  department: string;
  status: 'Published' | 'Draft' | 'Requires Attention' | 'Archived';
  notes: string;
}

const initial: Rota[] = [
  { id: 'r1', period: 'October 2026', department: 'Cardiology', status: 'Published', notes: 'Published on schedule, no outstanding gaps.' },
  { id: 'r2', period: 'November 2026', department: 'General Surgery', status: 'Draft', notes: 'Two night shifts still unassigned in week 3.' },
  { id: 'r3', period: 'September 2026', department: 'A&E', status: 'Requires Attention', notes: 'Fill rate below 90% threshold — Guardian flagged.' },
  { id: 'r4', period: 'November 2026', department: 'Medicine', status: 'Draft', notes: 'Awaiting sign-off from Clinical Director.' },
  { id: 'r5', period: 'August 2026', department: 'Cardiology', status: 'Archived', notes: 'Closed out, no exceptions carried forward.' },
  { id: 'r6', period: 'July 2026', department: 'A&E', status: 'Archived', notes: 'Closed out, 1 exception resolved post-publication.' },
];

const TABS = ['Active', 'Drafts', 'Archived'] as const;
type Tab = typeof TABS[number];

function chipClass(status: Rota['status']) {
  if (status === 'Published') return 'status-green';
  if (status === 'Draft') return 'status-amber';
  if (status === 'Requires Attention') return 'status-red';
  return 'status-chip bg-[#eee] text-pcl-muted';
}

const DEPARTMENTS = ['Cardiology', 'A&E', 'General Surgery', 'Medicine', 'Paediatrics', 'Anaesthetics', 'Oral & Maxillofacial Surgery (Dental)'];

export default function Scheduling() {
  const [rotas, setRotas] = useState(initial);
  const [tab, setTab] = useState<Tab>('Active');
  const [viewing, setViewing] = useState<Rota | null>(null);
  const [editing, setEditing] = useState<Rota | null>(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]);
  const [newPeriod, setNewPeriod] = useState('December 2026');

  const visible = rotas.filter(r =>
    tab === 'Active' ? (r.status === 'Published' || r.status === 'Requires Attention') :
    tab === 'Drafts' ? r.status === 'Draft' :
    r.status === 'Archived'
  );

  const resolve = (id: string) => setRotas(prev => prev.map(r => r.id === id ? { ...r, status: 'Published' } : r));
  const saveEdit = () => {
    if (!editing) return;
    setRotas(prev => prev.map(r => r.id === editing.id ? { ...r, notes: draftNotes } : r));
    setEditing(null);
  };
  const createRota = () => {
    const id = `r${Date.now()}`;
    setRotas(prev => [{ id, period: newPeriod, department: newDept, status: 'Draft', notes: 'New rota period \u2014 no shifts assigned yet. Run Workforce Optimisation to auto-fill against current constraints.' }, ...prev]);
    setCreating(false);
    setTab('Drafts');
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-4">Scheduling</h1>
      <div className="pcl-panel">
        <div className="pcl-panel-header">
          <span>Rota periods</span>
          <button className="btn-primary" onClick={() => setCreating(true)}>New rota period</button>
        </div>
        <div className="pcl-tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>Period</th><th>Department</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id}>
                <td>{r.period}</td>
                <td>{r.department}</td>
                <td><span className={chipClass(r.status)}>{r.status}</span></td>
                <td className="space-x-3">
                  <button className="text-pcl-blue hover:underline" onClick={() => setViewing(r)}>View</button>
                  {r.status === 'Draft' && (
                    <button className="text-pcl-blue hover:underline" onClick={() => { setEditing(r); setDraftNotes(r.notes); }}>Edit</button>
                  )}
                  {r.status === 'Requires Attention' && (
                    <button className="text-pcl-blue hover:underline" onClick={() => resolve(r.id)}>Resolve</button>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={4} className="text-center text-pcl-muted py-6">No rotas in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <Modal title={`${viewing.period} — ${viewing.department}`} onClose={() => setViewing(null)}>
          <div><span className={chipClass(viewing.status)}>{viewing.status}</span></div>
          <p className="text-pcl-muted">{viewing.notes}</p>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit — ${editing.period}`} onClose={() => setEditing(null)}>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Notes</label>
          <textarea
            className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue"
            rows={3}
            value={draftNotes}
            onChange={e => setDraftNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary" onClick={saveEdit}>Save</button>
          </div>
        </Modal>
      )}

      {creating && (
        <Modal title="New rota period" onClose={() => setCreating(false)}>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Department / specialty</label>
          <select className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={newDept} onChange={e => setNewDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">Rota period</label>
          <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={newPeriod} onChange={e => setNewPeriod(e.target.value)} />
          <div className="flex justify-end gap-2 pt-3">
            <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setCreating(false)}>Cancel</button>
            <button className="btn-primary" onClick={createRota}>Create draft rota</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
