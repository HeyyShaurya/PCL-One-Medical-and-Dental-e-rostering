import { useState } from 'react';
import { useStore } from '../../store';

interface Account {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

const initialAccounts: Account[] = [
  { id: 'a1', name: 'Dr. Sarah Jenkins', role: 'Consultant', department: 'Cardiology', status: 'Active' },
  { id: 'a2', name: 'Dr. Mark Thorne', role: 'Registrar', department: 'A&E', status: 'Active' },
  { id: 'a3', name: 'Lucy Chen', role: 'Roster Coordinator', department: 'Trust-wide', status: 'Active' },
  { id: 'a4', name: 'James Wilmot', role: 'Guardian of Safe Working', department: 'Trust-wide', status: 'Active' },
  { id: 'a5', name: 'Dr. Emily Sato', role: 'Junior Doctor', department: 'General Surgery', status: 'Active' },
  { id: 'a6', name: 'Priya Sharma', role: 'Clinical Director', department: 'Medicine', status: 'Active' },
  { id: 'a7', name: 'Dr. Aisha Patel', role: 'Junior Doctor', department: 'Paediatrics', status: 'Invited' },
  { id: 'a8', name: 'Dr. Tom Reid', role: 'Registrar', department: 'Anaesthetics', status: 'Suspended' },
];

const ACCOUNT_TABS = ['Active', 'Invited', 'Suspended'] as const;
type AccountTab = typeof ACCOUNT_TABS[number];
const MAIN_TABS = ['Staff accounts', 'Audit log', 'Security & compliance'] as const;
type MainTab = typeof MAIN_TABS[number];

function chipClass(status: Account['status']) {
  if (status === 'Active') return 'status-green';
  if (status === 'Invited') return 'status-amber';
  return 'status-red';
}

function CompItem({ label, value, status }: { label: string; value: string; status: 'Green' | 'Amber' }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line text-sm">
      <div>
        <div className="font-medium text-pcl-ink">{label}</div>
        <div className="text-pcl-muted text-xs">{value}</div>
      </div>
      <span className={status === 'Green' ? 'status-green' : 'status-amber'}>{status === 'Green' ? 'Met' : 'On track'}</span>
    </div>
  );
}

export default function Admin() {
  const { auditLog } = useStore();
  const [mainTab, setMainTab] = useState<MainTab>('Staff accounts');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [tab, setTab] = useState<AccountTab>('Active');
  const [resent, setResent] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Junior Doctor');
  const [inviteDept, setInviteDept] = useState('General Surgery');

  const visible = accounts.filter(a => a.status === tab);
  const setStatus = (id: string, status: Account['status']) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const resend = (id: string) => setResent(prev => [...prev, id]);
  const invite = () => {
    if (!inviteName.trim()) return;
    setAccounts(prev => [{ id: `a${Date.now()}`, name: inviteName, role: inviteRole, department: inviteDept, status: 'Invited' }, ...prev]);
    setInviting(false); setInviteName(''); setTab('Invited');
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Admin &amp; Security</h1>

      <div className="pcl-tabs bg-white border border-line !px-0">
        {MAIN_TABS.map(t => (
          <button key={t} className={t === mainTab ? 'active py-3 px-5' : 'py-3 px-5'} onClick={() => setMainTab(t)}>{t}</button>
        ))}
      </div>

      {mainTab === 'Staff accounts' && (
        <div className="pcl-panel">
          <div className="pcl-panel-header">
            <span>Staff accounts</span>
            <button className="btn-primary" onClick={() => setInviting(true)}>Invite user</button>
          </div>
          <div className="pcl-tabs">
            {ACCOUNT_TABS.map(t => (
              <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <table className="pcl-table">
            <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id}>
                  <td>{a.name}</td><td>{a.role}</td><td>{a.department}</td>
                  <td><span className={chipClass(a.status)}>{a.status}</span></td>
                  <td className="space-x-3">
                    {a.status === 'Active' && <button className="text-pcl-muted hover:underline" onClick={() => setStatus(a.id, 'Suspended')}>Suspend</button>}
                    {a.status === 'Invited' && (
                      resent.includes(a.id)
                        ? <span className="text-pcl-muted">Invitation resent</span>
                        : <button className="text-pcl-blue hover:underline" onClick={() => resend(a.id)}>Resend invite</button>
                    )}
                    {a.status === 'Suspended' && <button className="text-pcl-blue hover:underline" onClick={() => setStatus(a.id, 'Active')}>Reinstate</button>}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan={5} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {mainTab === 'Audit log' && (
        <div className="pcl-panel">
          <div className="pcl-panel-header"><span>Full audit trail</span><span className="text-xs text-pcl-muted font-normal">User \u00b7 date/time \u00b7 action</span></div>
          <table className="pcl-table">
            <thead><tr><th>User</th><th>Action</th><th>When</th></tr></thead>
            <tbody>
              {auditLog.map(e => (
                <tr key={e.id}><td>{e.user}</td><td>{e.action}</td><td className="whitespace-nowrap">{e.time}</td></tr>
              ))}
              {auditLog.length === 0 && (
                <tr><td colSpan={3} className="text-center text-pcl-muted py-6">No actions logged yet this session \u2014 every self-roster, exception, and approval you make elsewhere in the app appears here immediately.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {mainTab === 'Security & compliance' && (
        <div className="pcl-panel">
          <div className="pcl-panel-header"><span>Compliance posture</span></div>
          <div className="p-5">
            <CompItem label="NHS DTAC" value="Digital Technology Assessment Criteria completed" status="Green" />
            <CompItem label="ISO 27001" value="Certification in progress \u2014 target within 12 months of award" status="Amber" />
            <CompItem label="Cyber Essentials Plus" value="In progress \u2014 target within 12 months of award" status="Amber" />
            <CompItem label="UK hosting" value="All data hosted in UK data centres" status="Green" />
            <CompItem label="System uptime" value="99.9% target, 99.8% trailing 30-day actual" status="Green" />
            <CompItem label="14 NCSC Cloud Security Principles" value="Aligned \u2014 architecture overview available on request" status="Green" />
            <CompItem label="OWASP Top 10" value="Web application security aligned" status="Green" />
            <CompItem label="GDPR / DPIA" value="Data Protection Impact Assessment completed prior to service commencement" status="Green" />
            <CompItem label="Support SLA" value="Response &lt;1hr, P1 resolution &lt;4hrs, 24/7 support infrastructure" status="Green" />
          </div>
        </div>
      )}

      {inviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setInviting(false)} />
          <div className="relative bg-white border border-line shadow-xl w-full max-w-[480px]">
            <div className="pcl-panel-header"><span>Invite user</span></div>
            <div className="p-5 text-sm space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Name</label>
                <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Dr. Farah Iqbal" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Role</label>
                <select className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option>Junior Doctor</option><option>Registrar</option><option>Consultant</option><option>Roster Coordinator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Department</label>
                <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={inviteDept} onChange={e => setInviteDept(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setInviting(false)}>Cancel</button>
                <button className="btn-primary" onClick={invite} disabled={!inviteName.trim()}>Send invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
