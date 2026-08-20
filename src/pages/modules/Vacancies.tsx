import { useState } from 'react';
import Modal from '../../components/Modal';
import { useStore, VacancyItem } from '../../store';

const TABS = ['Open', 'Filled', 'Cancelled'] as const;
type Tab = typeof TABS[number];
const DEPARTMENTS = ['Cardiology', 'A&E', 'General Surgery', 'Medicine', 'Trauma & Orthopaedics', 'Paediatrics', 'Obstetrics & Gynaecology', 'Anaesthetics', 'Radiology', 'ICU / Critical Care'];
const SHIFTS = ['Long day', 'Night', 'Twilight', 'Weekend day', 'On-call'];

function chipClass(status: VacancyItem['status']) {
  if (status === 'Filled') return 'status-green';
  if (status === 'Open') return 'status-amber';
  return 'status-chip bg-[#eee] text-pcl-muted';
}

export default function Vacancies() {
  const { vacancies, postVacancy, fillVacancy, cancelVacancy } = useStore();
  const [tab, setTab] = useState<Tab>('Open');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [posting, setPosting] = useState(false);
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [shift, setShift] = useState(SHIFTS[0]);
  const [date, setDate] = useState('');
  const [justPosted, setJustPosted] = useState(false);

  const visible = vacancies.filter(v => v.status === tab);
  const pageItems = visible.slice(page * pageSize, page * pageSize + pageSize);
  const maxPage = Math.max(0, Math.ceil(visible.length / pageSize) - 1);

  const changeTab = (t: Tab) => { setTab(t); setPage(0); };
  const submitPost = () => {
    if (!date.trim()) return;
    postVacancy(dept, date, shift);
    setPosting(false); setDate('');
    setTab('Open'); setPage(0);
    setJustPosted(true);
    window.setTimeout(() => setJustPosted(false), 2500);
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Vacancy &amp; Temporary Workforce</h1>
      <p className="text-sm text-pcl-muted -mt-1">Unfilled shifts across all departments. A posted or system-flagged vacancy is cascaded to eligible staff automatically.</p>

      {justPosted && (
        <div className="pcl-panel border-l-4 p-4 text-sm" style={{ borderLeftColor: 'var(--color-status-green)' }}>
          <span className="status-green">Cascaded</span> <span className="ml-2">Vacancy posted and broadcast to eligible staff for self-rostering or bank/locum pickup.</span>
        </div>
      )}

      <div className="pcl-panel">
        <div className="pcl-panel-header">
          <span>Open shifts</span>
          <button className="btn-primary" onClick={() => setPosting(true)}>Post vacancy</button>
        </div>
        <div className="pcl-tabs">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3' : 'py-3'} onClick={() => changeTab(t)}>
              {t}{t === 'Open' ? ` (${vacancies.filter(v => v.status === 'Open').length})` : ''}
            </button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>Department</th><th>Date</th><th>Shift type</th><th>Source</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pageItems.map(v => (
              <tr key={v.id}>
                <td>{v.department}</td>
                <td>{v.date}</td>
                <td>{v.shiftType}</td>
                <td className="text-pcl-muted text-xs">{v.source ?? '\u2014'}</td>
                <td><span className={chipClass(v.status)}>{v.status}</span></td>
                <td className="space-x-3">
                  {v.status === 'Open' ? (
                    <>
                      <button className="text-pcl-blue hover:underline" onClick={() => fillVacancy(v.id)}>Fill</button>
                      <button className="text-pcl-muted hover:underline" onClick={() => cancelVacancy(v.id)}>Cancel</button>
                    </>
                  ) : <span className="text-pcl-muted">&mdash;</span>}
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr><td colSpan={6} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>
            )}
          </tbody>
        </table>
        {visible.length > pageSize && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-line text-sm text-pcl-muted">
            <span>Showing {page * pageSize + 1}&ndash;{Math.min((page + 1) * pageSize, visible.length)} of {visible.length}</span>
            <div className="space-x-3">
              <button className="text-pcl-blue hover:underline disabled:text-pcl-muted disabled:no-underline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="text-pcl-blue hover:underline disabled:text-pcl-muted disabled:no-underline" disabled={page >= maxPage} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {posting && (
        <Modal title="Post a vacancy" onClose={() => setPosting(false)}>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Department</label>
          <select className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={dept} onChange={e => setDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">Shift type</label>
          <select className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={shift} onChange={e => setShift(e.target.value)}>
            {SHIFTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">Date</label>
          <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" placeholder="e.g. 3 Sep 2026" value={date} onChange={e => setDate(e.target.value)} />
          <div className="flex justify-end gap-2 pt-3">
            <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setPosting(false)}>Cancel</button>
            <button className="btn-primary" onClick={submitPost} disabled={!date.trim()}>Post &amp; cascade</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
