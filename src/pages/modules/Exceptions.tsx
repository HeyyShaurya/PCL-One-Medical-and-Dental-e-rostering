import { useState } from 'react';
import Modal from '../../components/Modal';
import { useStore, ExceptionItem, ExceptionStatus, NewExceptionInput } from '../../store';

const TABS: ExceptionStatus[] = ['Submitted', 'Validated', 'Manager Review', 'Approved', 'Escalated', 'Closed'];

function chipClass(status: ExceptionStatus) {
  if (status === 'Submitted') return 'status-chip bg-[#e6f0f7] text-pcl-blue';
  if (status === 'Validated') return 'status-amber';
  if (status === 'Manager Review') return 'status-amber';
  if (status === 'Escalated') return 'status-red';
  if (status === 'Approved') return 'status-green';
  return 'status-chip bg-[#eee] text-pcl-muted';
}

const emptyForm: NewExceptionInput = {
  staff: '', department: 'General Surgery', rotaTemplate: 'Gen Surg SHO \u2014 Block 14', type: 'Missed rest break',
  description: '', patientSafety: false, actionTaken: '', geoEvidence: true
};

export default function Exceptions() {
  const { currentUser, exceptions, submitException, advanceException, approveException, escalateException, closeException, reopenException } = useStore();
  const [tab, setTab] = useState<ExceptionStatus>('Manager Review');
  const [viewing, setViewing] = useState<ExceptionItem | null>(null);
  const [logging, setLogging] = useState(false);
  const [form, setForm] = useState<NewExceptionInput>({ ...emptyForm, staff: currentUser?.name ?? '' });

  const visible = exceptions.filter(e => e.status === tab);

  const submit = () => {
    if (!form.description.trim() || !form.actionTaken.trim()) return;
    submitException(form);
    setLogging(false);
    setForm({ ...emptyForm, staff: currentUser?.name ?? '' });
    setTab('Submitted');
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Exceptions</h1>
      <p className="text-sm text-pcl-muted -mt-1">Guardian of Safe Working queue. Full lifecycle: Submitted \u2192 Validated \u2192 Manager Review \u2192 Approved / Escalated \u2192 Closed.</p>

      <div className="pcl-panel">
        <div className="pcl-panel-header">
          <span>Exception reports</span>
          <button className="btn-primary" onClick={() => setLogging(true)}>Log exception</button>
        </div>
        <div className="pcl-tabs overflow-x-auto">
          {TABS.map(t => (
            <button key={t} className={t === tab ? 'active py-3 whitespace-nowrap' : 'py-3 whitespace-nowrap'} onClick={() => setTab(t)}>
              {t}{` (${exceptions.filter(e => e.status === t).length})`}
            </button>
          ))}
        </div>
        <table className="pcl-table">
          <thead>
            <tr><th>Staff</th><th>Department</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(e => (
              <tr key={e.id}>
                <td>{e.staff}</td>
                <td>{e.department}</td>
                <td>{e.type}{e.patientSafety && <span className="status-red ml-2">Patient safety</span>}</td>
                <td>{e.date}</td>
                <td><span className={chipClass(e.status)}>{e.status}</span></td>
                <td className="space-x-3 whitespace-nowrap">
                  <button className="text-pcl-blue hover:underline" onClick={() => setViewing(e)}>View</button>
                  {e.status === 'Submitted' && <button className="text-pcl-blue hover:underline" onClick={() => advanceException(e.id)}>Validate</button>}
                  {e.status === 'Validated' && <button className="text-pcl-blue hover:underline" onClick={() => advanceException(e.id)}>Send to Guardian</button>}
                  {e.status === 'Manager Review' && (
                    <>
                      <button className="text-pcl-blue hover:underline" onClick={() => approveException(e.id, 'TOIL')}>Approve (TOIL)</button>
                      <button className="text-pcl-blue hover:underline" onClick={() => approveException(e.id, 'Reimbursement')}>Approve (Pay)</button>
                      {e.patientSafety && <button className="text-[#c62828] hover:underline" onClick={() => escalateException(e.id)}>Escalate</button>}
                    </>
                  )}
                  {(e.status === 'Approved' || e.status === 'Escalated') && <button className="text-pcl-blue hover:underline" onClick={() => closeException(e.id)}>Close</button>}
                  {e.status === 'Closed' && <button className="text-pcl-muted hover:underline" onClick={() => reopenException(e.id)}>Reopen</button>}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="text-center text-pcl-muted py-6">Nothing in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <Modal title={`${viewing.type} \u2014 ${viewing.staff}`} onClose={() => setViewing(null)}>
          <div><span className={chipClass(viewing.status)}>{viewing.status}</span></div>
          <p><strong>Rota template:</strong> {viewing.rotaTemplate}</p>
          <p><strong>Department:</strong> {viewing.department}</p>
          <p><strong>Submitted:</strong> {viewing.date}</p>
          <p><strong>Description:</strong> {viewing.description || '\u2014'}</p>
          <p><strong>Action already taken:</strong> {viewing.actionTaken || '\u2014'}</p>
          <p><strong>Immediate patient-safety concern:</strong> {viewing.patientSafety ? 'Yes' : 'No'}</p>
          <p><strong>Geo-location evidence attached:</strong> {viewing.geoEvidence ? 'Yes' : 'No'}</p>
          {viewing.recommendation && <p><strong>Recommendation:</strong> {viewing.recommendation}{viewing.penaltyAmount ? ` \u2014 \u00a3${viewing.penaltyAmount.toFixed(2)} penalty payment calculated` : ''}</p>}
        </Modal>
      )}

      {logging && (
        <Modal title="Log an exception report" onClose={() => setLogging(false)}>
          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted">Rota template</label>
          <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={form.rotaTemplate} onChange={e => setForm(f => ({ ...f, rotaTemplate: e.target.value }))} />

          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">Type</label>
          <select className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option>Missed rest break</option>
            <option>Exceeded 48hr average</option>
            <option>Late shift handover</option>
            <option>Short notice cancellation</option>
            <option>Unable to attend training</option>
          </select>

          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">What happened</label>
          <textarea className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" rows={3}
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the exception in your own words\u2026" />

          <label className="block text-xs font-bold uppercase tracking-wide text-pcl-muted mt-3">Action already taken</label>
          <input className="w-full border border-line p-2 text-sm outline-none focus:border-pcl-blue" value={form.actionTaken}
            onChange={e => setForm(f => ({ ...f, actionTaken: e.target.value }))} placeholder="e.g. Flagged to on-call consultant" />

          <label className="flex items-center gap-2 mt-3 text-sm">
            <input type="checkbox" checked={form.patientSafety} onChange={e => setForm(f => ({ ...f, patientSafety: e.target.checked }))} />
            This involves an immediate patient-safety concern
          </label>
          <label className="flex items-center gap-2 mt-1 text-sm">
            <input type="checkbox" checked={form.geoEvidence} onChange={e => setForm(f => ({ ...f, geoEvidence: e.target.checked }))} />
            Attach geo-location evidence
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <button className="px-4 py-2 text-sm border border-line hover:bg-[#f4f1ef]" onClick={() => setLogging(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit} disabled={!form.description.trim() || !form.actionTaken.trim()}>Submit exception report</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
