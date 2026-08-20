import { useState } from 'react';
import Modal from '../../components/Modal';
import { useStore, LeaveItem } from '../../store';

const TABS = ['Pending', 'Approved', 'Declined'] as const;
type Tab = typeof TABS[number];

function chipClass(status: LeaveItem['status']) {
  if (status === 'Approved') return 'status-green';
  if (status === 'Pending') return 'status-amber';
  return 'status-red';
}

export default function Leave() {
  const { currentUser, leaveRequests, requestLeave, approveLeave, declineLeave } = useStore();
  const [tab, setTab] = useState<Tab>('Pending');
  const [requesting, setRequesting] = useState(false);
  const [type, setType] = useState('Annual leave');
  const [dates, setDates] = useState('');
  const [soon, setSoon] = useState(false);

  const visible = leaveRequests.filter(l => l.status === tab);
  const pendingCount = leaveRequests.filter(l => l.status === 'Pending').length;

  const submit = () => {
    if (!dates.trim()) return;
    requestLeave({ staff: currentUser?.name ?? 'Staff', type, dates, withinSixWeeks: soon });
    setRequesting(false); setDates(''); setSoon(false); setTab('Pending');
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Leave</h1>
      <p className="text-sm text-pcl-muted -mt-1">Requests inside a 6-week window are routed to manual approval automatically; approvals update the home springboard immediately.</p>
      <div className="pcl-panel">
        <div className="pcl-panel-header">
          <span>Leave requests</span>
          <button className="btn-primary" onClick={() => setRequesting(true)}>New request</button>
        </div>
        <div className="pcl-tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => setTab(t)}>
              {t}{t === 'Pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
            </button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>Staff</th><th>Type</th><th>Dates</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(l => (
              <tr key={l.id}>
                <td>{l.staff}</td>
                <td>{l.type}</td>
                <td>{l.dates}{l.withinSixWeeks && l.status === 'Pending' && <span className="status-amber ml-2">Manual approval (&lt;6wks)</span>}</td>
                <td><span className={chipClass(l.status)}>{l.status}</span></td>
                <td className="space-x-3">
                  {l.status === 'Pending' ? (
                    <>
                      <button className="text-pcl-blue hover:underline" onClick={() => approveLeave(l.id)}>Approve</button>
                      <button className="text-pcl-muted hover:underline" onClick={() => declineLeave(l.id)}>Decline</button>
                    </>
                  ) : <span className="text-pcl-muted">No action needed</span>}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {requesting && (
        <Modal title="New leave request" onClose={() => setRequesting(false)}>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Type</label>
          <select className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={type} onChange={e => setType(e.target.value)}>
            <option>Annual leave</option>
            <option>Study leave</option>
            <option>Compassionate leave</option>
          </select>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">Dates</label>
          <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" placeholder="e.g. 14\u201316 Sep 2026"
            value={dates} onChange={e => setDates(e.target.value)} />
          <label className="flex items-center gap-2 mt-3 text-sm">
            <input type="checkbox" checked={soon} onChange={e => setSoon(e.target.checked)} />
            This falls within 6 weeks from today
          </label>
          <p className="text-xs text-pcl-muted mt-2">Requests inside 6 weeks are automatically routed for manual sign-off instead of the standard approval path.</p>
          <div className="flex justify-end gap-2 pt-3">
            <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setRequesting(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit} disabled={!dates.trim()}>Submit request</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
