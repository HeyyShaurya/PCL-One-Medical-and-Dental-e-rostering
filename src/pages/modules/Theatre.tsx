import { useState } from 'react';
import Modal from '../../components/Modal';

interface Session {
  id: string;
  session: string;
  specialty: string;
  lead: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  primaryIsTrainee: boolean;
  supervisor?: string;
  supervisorContact?: string;
  rebookPrompt?: boolean;
}

const initial: Session[] = [
  { id: 't1', session: 'AM List \u2014 Theatre 3', specialty: 'Trauma & Orthopaedics', lead: 'Mr. J Whitfield', status: 'Scheduled', primaryIsTrainee: false },
  { id: 't2', session: 'PM List \u2014 Theatre 1', specialty: 'General Surgery', lead: 'Priya Sharma', status: 'Scheduled', primaryIsTrainee: false },
  {
    id: 't3', session: 'AM List \u2014 Theatre 2 (Anaesthetics)', specialty: 'Anaesthetics', lead: 'Dr. Tom Reid', status: 'In Progress',
    primaryIsTrainee: true, supervisor: 'Dr. Sarah Jenkins, Consultant Anaesthetist', supervisorContact: 'Bleep 4471 \u00b7 ext. 2290'
  },
  { id: 't4', session: 'Emergency List', specialty: 'A&E', lead: 'Dr. Mark Thorne', status: 'Completed', primaryIsTrainee: false },
  { id: 't5', session: 'PM List \u2014 Theatre 4', specialty: 'Obstetrics & Gynaecology', lead: 'Ms. R Okafor', status: 'Completed', primaryIsTrainee: false },
];

const TABS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const;
type Tab = typeof TABS[number];

function chipClass(status: Session['status']) {
  if (status === 'Completed') return 'status-green';
  if (status === 'In Progress') return 'status-amber';
  if (status === 'Cancelled') return 'status-chip bg-[#eee] text-pcl-muted';
  return 'status-chip bg-[#e6f0f7] text-pcl-blue';
}

const nextStatus: Record<Session['status'], Session['status'] | null> = {
  Scheduled: 'In Progress', 'In Progress': 'Completed', Completed: null, Cancelled: null,
};
const actionLabel: Record<Session['status'], string> = {
  Scheduled: 'Start', 'In Progress': 'Complete', Completed: '', Cancelled: '',
};

export default function Theatre() {
  const [sessions, setSessions] = useState(initial);
  const [tab, setTab] = useState<Tab>('Scheduled');
  const [rebooking, setRebooking] = useState<Session | null>(null);

  const visible = sessions.filter(s => s.status === tab);
  const advance = (id: string) => setSessions(prev => prev.map(s => {
    if (s.id !== id) return s;
    const next = nextStatus[s.status];
    return next ? { ...s, status: next } : s;
  }));
  const cancel = (s: Session) => {
    setSessions(prev => prev.map(x => x.id === s.id ? { ...x, status: 'Cancelled', rebookPrompt: true } : x));
    setRebooking(s);
  };
  const rebook = (id: string) => {
    setSessions(prev => prev.map(x => x.id === id ? { ...x, rebookPrompt: false } : x));
    setRebooking(null);
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Theatre &amp; Anaesthetics</h1>
      <p className="text-sm text-pcl-muted -mt-1">Session allocation across sites, with automatic release on cancellation and named supervisor visibility for trainees.</p>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Operating &amp; anaesthetics lists</span></div>
        <div className="pcl-tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>Session</th><th>Specialty</th><th>Lead</th><th>Supervision</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(s => (
              <tr key={s.id}>
                <td>{s.session}</td>
                <td>{s.specialty}</td>
                <td>{s.lead}</td>
                <td>
                  {s.primaryIsTrainee ? (
                    <span className="text-xs">
                      <span className="status-amber">Trainee is primary</span>
                      <div className="text-pcl-muted mt-0.5">Supervisor: {s.supervisor}<br />{s.supervisorContact}</div>
                    </span>
                  ) : <span className="text-pcl-muted text-xs">Autonomous practitioner</span>}
                </td>
                <td><span className={chipClass(s.status)}>{s.status}</span></td>
                <td className="space-x-3 whitespace-nowrap">
                  {s.status !== 'Completed' && s.status !== 'Cancelled' && (
                    <>
                      <button className="text-pcl-blue hover:underline" onClick={() => advance(s.id)}>{actionLabel[s.status]}</button>
                      <button className="text-[#c62828] hover:underline" onClick={() => cancel(s)}>Cancel session</button>
                    </>
                  )}
                  {(s.status === 'Completed' || s.status === 'Cancelled') && <span className="text-pcl-muted">&mdash;</span>}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {rebooking && (
        <Modal title="Session cancelled" onClose={() => setRebooking(null)}>
          <p>{rebooking.lead} has been automatically released from <strong>{rebooking.session}</strong>.</p>
          <p className="text-pcl-muted">Rebook them into another available session so the hours aren&rsquo;t lost?</p>
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setRebooking(null)}>Not now</button>
            <button className="btn-primary" onClick={() => rebook(rebooking.id)}>Offer AM List &mdash; Theatre 3</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
