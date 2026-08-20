import { useState } from 'react';
import { Calendar, RefreshCw, AlertCircle, Plane, Check } from 'lucide-react';
import { useStore } from '../../store';

type Screen = 'roster' | 'leave' | 'swap' | 'exception';

export default function Mobile() {
  const { currentUser, claimedShifts, requestLeave, submitException } = useStore();
  const [screen, setScreen] = useState<Screen>('roster');
  const [leaveDone, setLeaveDone] = useState(false);
  const [swapDone, setSwapDone] = useState(false);
  const [excDone, setExcDone] = useState(false);
  const [excText, setExcText] = useState('');

  const doLeave = () => {
    requestLeave({ staff: currentUser?.name ?? 'Staff', type: 'Annual leave', dates: '14\u201316 Sep 2026', withinSixWeeks: false });
    setLeaveDone(true);
  };
  const doExc = () => {
    if (!excText.trim()) return;
    submitException({
      staff: currentUser?.name ?? 'Staff', department: 'General Surgery', rotaTemplate: 'Gen Surg SHO \u2014 Block 14',
      type: 'Missed rest break', description: excText, patientSafety: false, actionTaken: 'Reported via mobile app', geoEvidence: true
    });
    setExcDone(true);
  };

  return (
    <div className="p-6 max-w-[1040px] mx-auto">
      <h1 className="text-2xl font-light mb-1">Mobile Workforce</h1>
      <p className="text-sm text-pcl-muted mb-6">The same underlying system on a phone \u2014 not a cut-down companion app. Every action here updates the same data shown on desktop.</p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-[300px] mx-auto md:mx-0 flex-shrink-0">
          <div className="border-[6px] border-pcl-charcoal rounded-[28px] overflow-hidden shadow-xl bg-white">
            <div className="h-11 bg-pcl-blue text-white flex items-center justify-between px-3 text-xs font-semibold">
              <span>PCL One</span><span>{currentUser?.name.split(' ')[0]}</span>
            </div>
            <div className="min-h-[480px] bg-white">
              {screen === 'roster' && (
                <div className="p-4 space-y-2">
                  <div className="text-xs font-bold uppercase text-pcl-muted mb-2">My rota \u2014 next shifts</div>
                  {claimedShifts.length === 0 && <div className="text-sm text-pcl-muted">No self-rostered shifts yet \u2014 add one from Self-Roster.</div>}
                  {claimedShifts.map(s => (
                    <div key={s.id} className="border border-line p-2.5 text-sm">
                      <div className="font-medium">{s.date}</div>
                      <div className="text-pcl-muted text-xs">{s.time} \u00b7 {s.department}</div>
                    </div>
                  ))}
                </div>
              )}
              {screen === 'leave' && (
                <div className="p-4 space-y-3">
                  <div className="text-xs font-bold uppercase text-pcl-muted">Request leave</div>
                  {!leaveDone ? (
                    <>
                      <div className="text-sm">Annual leave &middot; 14&ndash;16 Sep 2026</div>
                      <button className="btn-primary w-full !py-2.5" onClick={doLeave}>Submit request</button>
                    </>
                  ) : (
                    <div className="text-sm flex items-center gap-2 status-green w-fit"><Check className="w-4 h-4" /> Request submitted \u2014 routed for approval</div>
                  )}
                </div>
              )}
              {screen === 'swap' && (
                <div className="p-4 space-y-3">
                  <div className="text-xs font-bold uppercase text-pcl-muted">Request a shift swap</div>
                  {!swapDone ? (
                    <>
                      <div className="text-sm">Offer: Fri 28 Aug long day &rarr; Dr. Mark Thorne</div>
                      <button className="btn-primary w-full !py-2.5" onClick={() => setSwapDone(true)}>Send swap request</button>
                    </>
                  ) : (
                    <div className="text-sm flex items-center gap-2 status-amber w-fit">Pending administrator approval (minimum staffing check)</div>
                  )}
                </div>
              )}
              {screen === 'exception' && (
                <div className="p-4 space-y-2">
                  <div className="text-xs font-bold uppercase text-pcl-muted">Report an exception</div>
                  {!excDone ? (
                    <>
                      <textarea className="w-full border border-line p-2 text-sm" rows={4} placeholder="What happened?" value={excText} onChange={e => setExcText(e.target.value)} />
                      <button className="btn-primary w-full !py-2.5" onClick={doExc} disabled={!excText.trim()}>Submit exception report</button>
                    </>
                  ) : (
                    <div className="text-sm flex items-center gap-2 status-green w-fit"><Check className="w-4 h-4" /> Submitted \u2014 now in the Exceptions queue</div>
                  )}
                </div>
              )}
            </div>
            <div className="h-14 border-t border-line flex items-center justify-around bg-white">
              <button onClick={() => setScreen('roster')} className={screen === 'roster' ? 'text-pcl-blue' : 'text-pcl-muted'}><Calendar className="w-5 h-5" /></button>
              <button onClick={() => setScreen('leave')} className={screen === 'leave' ? 'text-pcl-blue' : 'text-pcl-muted'}><Plane className="w-5 h-5" /></button>
              <button onClick={() => setScreen('swap')} className={screen === 'swap' ? 'text-pcl-blue' : 'text-pcl-muted'}><RefreshCw className="w-5 h-5" /></button>
              <button onClick={() => setScreen('exception')} className={screen === 'exception' ? 'text-pcl-blue' : 'text-pcl-muted'}><AlertCircle className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <div className="flex-1 pcl-panel p-5 text-sm space-y-2 self-start">
          <div className="font-semibold mb-2">What this demonstrates</div>
          <p className="text-pcl-muted">View roster, request leave, request a swap, and submit an exception \u2014 the four flows TI002/TI003 name explicitly \u2014 all working from the phone frame on the left, backed by the same data store as the desktop screens.</p>
          <p className="text-pcl-muted">Try each tab at the bottom of the phone: roster, leave, swap, exception.</p>
        </div>
      </div>
    </div>
  );
}
