import { useState } from 'react';
import { useStore } from '../../store';

export default function SelfRoster() {
  const { currentUser, openSelfRosterShifts, claimedShifts, claimedHours, claimShift } = useStore();
  const [blocked, setBlocked] = useState<{ shiftId: string; reason: string; alternativeId?: string } | null>(null);
  const [justClaimed, setJustClaimed] = useState<string | null>(null);

  const handleClaim = (id: string) => {
    setBlocked(null);
    setJustClaimed(null);
    const result = claimShift(id);
    if (result.ok) {
      setJustClaimed(id);
      window.setTimeout(() => setJustClaimed(null), 2500);
    } else {
      setBlocked({ shiftId: id, reason: result.reason, alternativeId: result.alternativeId });
    }
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Self-Roster</h1>
      <p className="text-sm text-pcl-muted -mt-1">
        Signed in as {currentUser?.name}. Select an open shift to roster yourself onto it \u2014 every selection is checked live against your contract, rest-period rules and minimum staffing before it is confirmed.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="pcl-panel p-5 text-center">
          <div className="text-[30px] font-light text-pcl-blue tabular-nums">{claimedHours}</div>
          <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Hours self-rostered this period</div>
        </div>
        <div className="pcl-panel p-5 text-center">
          <div className="text-[30px] font-light text-pcl-blue tabular-nums">{openSelfRosterShifts.length}</div>
          <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Open shifts available to you</div>
        </div>
        <div className="pcl-panel p-5 text-center">
          <div className="text-[30px] font-light text-pcl-blue tabular-nums">{claimedShifts.length}</div>
          <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Shifts confirmed on your rota</div>
        </div>
      </div>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Open shifts you can self-roster \u2014 General Surgery SHO, Block 14</span></div>
        <table className="pcl-table">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Department</th><th>Hours</th><th>Action</th></tr>
          </thead>
          <tbody>
            {openSelfRosterShifts.map(s => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td className="tabular">{s.time}</td>
                <td>{s.department}</td>
                <td className="tabular">{s.hours}</td>
                <td>
                  <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => handleClaim(s.id)}>Self-roster this shift</button>
                </td>
              </tr>
            ))}
            {openSelfRosterShifts.length === 0 && (
              <tr><td colSpan={5} className="text-center text-pcl-muted py-6">No further open shifts in this rota block.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {blocked && (
        <div className="pcl-panel border-l-4" style={{ borderLeftColor: 'var(--color-status-red)' }}>
          <div className="pcl-panel-header !bg-transparent">
            <span className="status-red">Blocked \u2014 not compliant</span>
          </div>
          <div className="p-5 text-sm space-y-3">
            <p>This shift cannot be self-rostered: <strong>{blocked.reason}</strong></p>
            <p className="text-pcl-muted">Self-rostering onto a non-compliant shift is not permitted \u2014 by swap, exchange, or direct selection \u2014 under FR039 of the specification. This is enforced automatically, not by staff judgement.</p>
            {blocked.alternativeId && (
              <button
                className="btn-gold"
                onClick={() => { const alt = blocked.alternativeId!; setBlocked(null); handleClaim(alt); }}
              >
                Roster the compliant alternative shift instead
              </button>
            )}
          </div>
        </div>
      )}

      {justClaimed && (
        <div className="pcl-panel border-l-4" style={{ borderLeftColor: 'var(--color-status-green)' }}>
          <div className="p-4 text-sm">
            <span className="status-green">Confirmed</span>
            <span className="ml-2">Shift added to your rota. Compliance check passed \u2014 rest period, EWTD hours and minimum staffing all clear.</span>
          </div>
        </div>
      )}

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Your confirmed self-rostered shifts</span></div>
        <table className="pcl-table">
          <thead><tr><th>Date</th><th>Time</th><th>Department</th><th>Hours</th></tr></thead>
          <tbody>
            {claimedShifts.map(s => (
              <tr key={s.id}><td>{s.date}</td><td className="tabular">{s.time}</td><td>{s.department}</td><td className="tabular">{s.hours}</td></tr>
            ))}
            {claimedShifts.length === 0 && (
              <tr><td colSpan={4} className="text-center text-pcl-muted py-6">No shifts self-rostered yet this session.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
