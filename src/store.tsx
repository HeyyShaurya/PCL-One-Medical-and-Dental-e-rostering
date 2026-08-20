import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const PERSONAS = [
  { id: '1', name: 'Dr. Sarah Jenkins', role: 'Consultant', dept: 'Cardiology' },
  { id: '2', name: 'Dr. Mark Thorne', role: 'Registrar', dept: 'A&E' },
  { id: '3', name: 'Lucy Chen', role: 'Roster Coordinator', dept: 'Trust-wide' },
  { id: '4', name: 'James Wilmot', role: 'Guardian of Safe Working', dept: 'Trust-wide' },
  { id: '5', name: 'Dr. Emily Sato', role: 'Junior Doctor', dept: 'General Surgery' },
  { id: '6', name: 'Priya Sharma', role: 'Clinical Director', dept: 'Medicine' }
];

// Titles to strip when deriving a first-name greeting (avoids "Good morning, Dr.")
const TITLES = ['Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Prof.'];
export function firstNameOf(fullName: string): string {
  const parts = fullName.split(' ');
  const idx = TITLES.includes(parts[0]) ? 1 : 0;
  return parts[idx] ?? parts[0];
}

// ---------- Exceptions (FR043–FR046, Pass/Fail Q3) ----------
// Lifecycle exactly as specified in the tender brief:
// Submitted -> Validated -> Manager Review -> Approved | Escalated -> Closed
export type ExceptionStatus = 'Submitted' | 'Validated' | 'Manager Review' | 'Approved' | 'Escalated' | 'Closed';

export interface ExceptionItem {
  id: string;
  staff: string;
  department: string;
  rotaTemplate: string;
  type: string;
  description: string;
  patientSafety: boolean;
  actionTaken: string;
  geoEvidence: boolean;
  date: string;
  status: ExceptionStatus;
  recommendation: 'TOIL' | 'Reimbursement' | 'No action' | null;
  toilTaken: boolean;
  penaltyAmount: number | null;
}

export interface NewExceptionInput {
  staff: string;
  department: string;
  rotaTemplate: string;
  type: string;
  description: string;
  patientSafety: boolean;
  actionTaken: string;
  geoEvidence: boolean;
}

const initialExceptions: ExceptionItem[] = [
  { id: 'ex1', staff: 'Dr. Emily Sato', department: 'General Surgery', rotaTemplate: 'Gen Surg SHO — Block 14', type: 'Missed rest break', description: 'No 30-minute break during a 10hr shift due to emergency theatre list.', patientSafety: false, actionTaken: 'Flagged to on-call consultant at the time.', geoEvidence: true, date: '14 Oct 2026', status: 'Manager Review', recommendation: null, toilTaken: false, penaltyAmount: null },
  { id: 'ex2', staff: 'Dr. Mark Thorne', department: 'A&E', rotaTemplate: 'A&E Registrar — Block 9', type: 'Exceeded 48hr average', description: 'Rolling 17-week average exceeded 48hrs after covering a colleague\u2019s sickness absence.', patientSafety: false, actionTaken: 'Reported via app at end of shift.', geoEvidence: false, date: '13 Oct 2026', status: 'Validated', recommendation: null, toilTaken: false, penaltyAmount: null },
  { id: 'ex3', staff: 'Dr. Aisha Patel', department: 'Paediatrics', rotaTemplate: 'Paeds Reg — Block 11', type: 'Late shift handover', description: 'Handover delayed 45 minutes due to a deteriorating patient.', patientSafety: true, actionTaken: 'Escalated to nurse in charge immediately.', geoEvidence: true, date: '11 Oct 2026', status: 'Submitted', recommendation: null, toilTaken: false, penaltyAmount: null },
  { id: 'ex4', staff: 'Dr. Sarah Jenkins', department: 'Cardiology', rotaTemplate: 'Cardiology Cons — Block 14', type: 'Short notice cancellation', description: 'On-call swap cancelled with under 24hrs notice, worked an unplanned extra 8hrs.', patientSafety: false, actionTaken: 'Logged same day.', geoEvidence: false, date: '9 Oct 2026', status: 'Approved', recommendation: 'TOIL', toilTaken: true, penaltyAmount: null },
  { id: 'ex5', staff: 'Dr. Tom Reid', department: 'Anaesthetics', rotaTemplate: 'Anaesthetics SpR — Block 8', type: 'Missed rest break', description: 'No compensatory rest taken after a night shift ran 90 minutes over.', patientSafety: false, actionTaken: 'Reported next working day.', geoEvidence: false, date: '2 Oct 2026', status: 'Closed', recommendation: 'Reimbursement', toilTaken: false, penaltyAmount: 84.5 }
];

// ---------- Leave ----------
export interface LeaveItem {
  id: string;
  staff: string;
  type: string;
  dates: string;
  status: 'Pending' | 'Approved' | 'Declined';
  withinSixWeeks: boolean;
}

export interface NewLeaveInput {
  staff: string;
  type: string;
  dates: string;
  withinSixWeeks: boolean;
}

const initialLeave: LeaveItem[] = [
  { id: 'lv1', staff: 'Dr. Emily Sato', type: 'Annual leave', dates: '2\u20136 Nov 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv2', staff: 'Dr. Mark Thorne', type: 'Study leave', dates: '18 Nov 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv3', staff: 'Priya Sharma', type: 'Annual leave', dates: '23\u201327 Nov 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv4', staff: 'Dr. Aisha Patel', type: 'Annual leave', dates: '30 Nov\u20132 Dec 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv5', staff: 'Dr. Tom Reid', type: 'Study leave', dates: '5 Dec 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv6', staff: 'Dr. Sarah Jenkins', type: 'Annual leave', dates: '28\u201330 Aug 2026', status: 'Pending', withinSixWeeks: true },
  { id: 'lv7', staff: 'Lucy Chen', type: 'Annual leave', dates: '19 Dec 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv8', staff: 'James Wilmot', type: 'Compassionate leave', dates: '21 Oct 2026', status: 'Pending', withinSixWeeks: false },
  { id: 'lv9', staff: 'Dr. Mark Thorne', type: 'Annual leave', dates: '3\u20137 Aug 2026', status: 'Approved', withinSixWeeks: false },
  { id: 'lv10', staff: 'Dr. Emily Sato', type: 'Study leave', dates: '15 Sep 2026', status: 'Declined', withinSixWeeks: false }
];

// ---------- Vacancies / temporary workforce ----------
export interface VacancyItem {
  id: string;
  department: string;
  date: string;
  shiftType: string;
  status: 'Open' | 'Filled' | 'Cancelled';
  source?: 'Cascade' | 'Locum (Agile Workforce)';
}

const VACANCY_DEPTS = ['Cardiology', 'A&E', 'General Surgery', 'Medicine', 'Trauma & Orthopaedics', 'Paediatrics', 'Obstetrics & Gynaecology', 'Anaesthetics', 'Radiology', 'ICU / Critical Care'];
const VACANCY_SHIFTS = ['Long day', 'Night', 'Twilight', 'Weekend day', 'On-call'];
function buildVacancies(): VacancyItem[] {
  const items: VacancyItem[] = [];
  for (let i = 0; i < 24; i++) {
    const dept = VACANCY_DEPTS[i % VACANCY_DEPTS.length];
    const shift = VACANCY_SHIFTS[i % VACANCY_SHIFTS.length];
    const day = (i % 28) + 1;
    items.push({ id: `vc-open-${i}`, department: dept, date: `${day} Nov 2026`, shiftType: shift, status: 'Open', source: 'Cascade' });
  }
  ['Cardiology', 'A&E', 'Medicine', 'Radiology'].forEach((dept, i) => {
    items.push({ id: `vc-filled-${i}`, department: dept, date: `${(i + 1) * 3} Nov 2026`, shiftType: VACANCY_SHIFTS[i % VACANCY_SHIFTS.length], status: 'Filled', source: i % 2 === 0 ? 'Locum (Agile Workforce)' : 'Cascade' });
  });
  ['Paediatrics', 'ICU / Critical Care'].forEach((dept, i) => {
    items.push({ id: `vc-cancel-${i}`, department: dept, date: `${(i + 1) * 5} Nov 2026`, shiftType: VACANCY_SHIFTS[i % VACANCY_SHIFTS.length], status: 'Cancelled' });
  });
  return items;
}

// ---------- Self-rostering (Pass/Fail Q2) ----------
export interface SelfRosterShift {
  id: string;
  date: string;
  time: string;
  department: string;
  hours: number;
  compliant: boolean;
  breachReason?: string;
  alternativeId?: string;
}

const initialOpenShifts: SelfRosterShift[] = [
  { id: 'sr1', date: 'Mon 24 Aug 2026', time: '08:00\u201320:00', department: 'General Surgery', hours: 12, compliant: true },
  { id: 'sr2', date: 'Wed 26 Aug 2026', time: '20:00\u201308:00', department: 'General Surgery', hours: 12, compliant: true },
  {
    id: 'sr3', date: 'Thu 27 Aug 2026', time: '20:00\u201308:00', department: 'General Surgery', hours: 12,
    compliant: false,
    breachReason: 'Would leave less than the 11-hour minimum rest period after her previous shift, breaching 2016 TCS Schedule 3 rest requirements.',
    alternativeId: 'sr4'
  },
  { id: 'sr4', date: 'Fri 28 Aug 2026', time: '08:00\u201320:00', department: 'General Surgery', hours: 12, compliant: true },
  { id: 'sr5', date: 'Sun 30 Aug 2026', time: '08:00\u201318:00', department: 'General Surgery', hours: 10, compliant: true }
];

// ---------- Rota optimisation run (Quality Q1, 8%) ----------
export interface OptimisationRun {
  status: 'idle' | 'running' | 'done';
  gapsBefore: number;
  gapsAfter: number;
  fillRatePct: number;
  remainingGaps: { shift: string; reason: string }[];
}

const idleRun: OptimisationRun = { status: 'idle', gapsBefore: 0, gapsAfter: 0, fillRatePct: 0, remainingGaps: [] };

// ---------- ESR / integration sync log (FR050, FR052) ----------
export interface SyncLogEntry {
  id: string;
  time: string;
  event: string;
  detail: string;
  direction: 'ESR \u2192 PCL One' | 'PCL One \u2192 ESR';
}

const initialSyncLog: SyncLogEntry[] = [
  { id: 'sl1', time: '2 min ago', event: 'Scheduled sync completed', detail: '46 records reconciled, 0 errors', direction: 'ESR \u2192 PCL One' },
  { id: 'sl2', time: '38 min ago', event: 'Contract hours update pushed', detail: 'Dr. Aisha Patel \u2014 0.6 WTE effective 1 Sep 2026', direction: 'PCL One \u2192 ESR' }
];

// ---------- KPI dashboard (Appendix A, KPIs 1\u20138) ----------
export interface KpiTile {
  id: string;
  name: string;
  value: string;
  target: string;
  status: 'Green' | 'Amber' | 'Red';
  trend: number[];
}

export const KPI_TILES: KpiTile[] = [
  { id: 'kpi1', name: 'System Availability', value: '99.8%', target: '>99.5% = Green', status: 'Green', trend: [99.6, 99.7, 99.9, 99.8, 99.9, 99.8] },
  { id: 'kpi2', name: 'Incident Resolution', value: '0.6 hr avg response', target: '<1 hr = Green', status: 'Green', trend: [0.9, 0.8, 0.7, 0.6, 0.5, 0.6] },
  { id: 'kpi3', name: 'Data Integration (ESR)', value: '98.4%', target: '95\u2013100% = Green', status: 'Green', trend: [96, 97, 98, 97, 99, 98.4] },
  { id: 'kpi4', name: 'Rota Compliance (EWTD)', value: '100%', target: '100% = Green', status: 'Green', trend: [100, 100, 99, 100, 100, 100] },
  { id: 'kpi5', name: 'Vacancy ID & Fill Rate', value: '100% ID / 96.8% fill', target: '>96% fill = Green', status: 'Green', trend: [94, 95, 96, 97, 96, 96.8] },
  { id: 'kpi6', name: 'Exception Reporting Processing', value: '99.6% availability', target: '>99% = Green', status: 'Green', trend: [99.1, 99.3, 99.5, 99.4, 99.6, 99.6] },
  { id: 'kpi7', name: 'Roadmap Engagement', value: '100% logged & tracked', target: '100% = Green', status: 'Green', trend: [100, 100, 100, 98, 100, 100] },
  { id: 'kpi8', name: 'Rota Publication Timeliness', value: '97.2% published in advance', target: '95\u2013100% = Green', status: 'Green', trend: [93, 95, 96, 97, 96, 97.2] }
];

// ---------- Audit log (FR037) ----------
export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  time: string;
}

// ---------- Notifications ----------
export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  { id: 'n1', text: '3 exception reports are awaiting Guardian review', time: '10 min ago', read: false },
  { id: 'n2', text: 'November 2026 Cardiology rota is still in draft', time: '1 hr ago', read: false },
  { id: 'n3', text: '8 leave requests are pending manual approval', time: '2 hr ago', read: false },
  { id: 'n4', text: 'ESR integration sync completed \u2014 46 records reconciled', time: '2 min ago', read: false },
  { id: 'n5', text: 'October 2026 A&E rota published successfully', time: '2 days ago', read: true }
];

interface StoreState {
  currentUser: typeof PERSONAS[0] | null;
  trust: string;
  pendingExceptions: number;
  pendingLeaves: number;
  openShifts: number;
  nextPublishDate: string;
  login: (user: typeof PERSONAS[0]) => void;
  logout: () => void;
  setTrust: (trust: string) => void;

  exceptions: ExceptionItem[];
  submitException: (input: NewExceptionInput) => string;
  advanceException: (id: string) => void;
  approveException: (id: string, recommendation: 'TOIL' | 'Reimbursement' | 'No action') => void;
  escalateException: (id: string) => void;
  closeException: (id: string) => void;
  reopenException: (id: string) => void;

  leaveRequests: LeaveItem[];
  requestLeave: (input: NewLeaveInput) => void;
  approveLeave: (id: string) => void;
  declineLeave: (id: string) => void;

  vacancies: VacancyItem[];
  postVacancy: (department: string, date: string, shiftType: string) => void;
  fillVacancy: (id: string) => void;
  cancelVacancy: (id: string) => void;

  openSelfRosterShifts: SelfRosterShift[];
  claimedShifts: SelfRosterShift[];
  claimedHours: number;
  claimShift: (id: string) => { ok: true } | { ok: false; reason: string; alternativeId?: string };

  optimisationRun: OptimisationRun;
  runOptimisation: () => void;

  syncLog: SyncLogEntry[];
  simulateEsrNewStarter: () => void;

  auditLog: AuditEntry[];

  notifications: NotificationItem[];
  notifCount: number;
  markAllNotificationsRead: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const SESSION_KEY = 'pclone-session-v2';
const DATA_KEY = 'pclone-data-v2';

function loadPersistedData() {
  try {
    const raw = sessionStorage.getItem(DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      exceptions: ExceptionItem[]; leaveRequests: LeaveItem[]; vacancies: VacancyItem[];
      notifications: NotificationItem[]; openSelfRosterShifts: SelfRosterShift[]; claimedShifts: SelfRosterShift[];
      claimedHours: number; syncLog: SyncLogEntry[]; auditLog: AuditEntry[];
    };
  } catch {
    return null;
  }
}

function nowLabel() {
  return 'just now';
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<typeof PERSONAS[0] | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const savedId = JSON.parse(raw)?.id;
      return PERSONAS.find(p => p.id === savedId) ?? null;
    } catch {
      return null;
    }
  });
  const [trust, setTrust] = useState('Rotherham');
  const persisted = loadPersistedData();
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(persisted?.exceptions ?? initialExceptions);
  const [leaveRequests, setLeaveRequests] = useState<LeaveItem[]>(persisted?.leaveRequests ?? initialLeave);
  const [vacancies, setVacancies] = useState<VacancyItem[]>(persisted?.vacancies ?? buildVacancies());
  const [notifications, setNotifications] = useState<NotificationItem[]>(persisted?.notifications ?? initialNotifications);
  const [openSelfRosterShifts, setOpenSelfRosterShifts] = useState<SelfRosterShift[]>(persisted?.openSelfRosterShifts ?? initialOpenShifts);
  const [claimedShifts, setClaimedShifts] = useState<SelfRosterShift[]>(persisted?.claimedShifts ?? []);
  const [claimedHours, setClaimedHours] = useState<number>(persisted?.claimedHours ?? 0);
  const [optimisationRun, setOptimisationRun] = useState<OptimisationRun>(idleRun);
  const [syncLog, setSyncLog] = useState<SyncLogEntry[]>(persisted?.syncLog ?? initialSyncLog);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(persisted?.auditLog ?? []);

  useEffect(() => {
    try {
      if (currentUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: currentUser.id }));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch { /* sessionStorage unavailable */ }
  }, [currentUser]);

  useEffect(() => {
    try {
      sessionStorage.setItem(DATA_KEY, JSON.stringify({
        exceptions, leaveRequests, vacancies, notifications, openSelfRosterShifts, claimedShifts, claimedHours, syncLog, auditLog
      }));
    } catch { /* sessionStorage unavailable */ }
  }, [exceptions, leaveRequests, vacancies, notifications, openSelfRosterShifts, claimedShifts, claimedHours, syncLog, auditLog]);

  const log = (action: string) => {
    setAuditLog(prev => [{ id: `a${prev.length + 1}-${Date.now()}`, user: currentUser?.name ?? 'System', action, time: nowLabel() }, ...prev].slice(0, 200));
  };

  const login = (user: typeof PERSONAS[0]) => {
    setCurrentUser(user);
    setAuditLog(prev => [{ id: `a${prev.length + 1}-${Date.now()}`, user: user.name, action: 'Signed in', time: nowLabel() }, ...prev]);
  };
  const logout = () => {
    setCurrentUser(null);
    setExceptions(initialExceptions);
    setLeaveRequests(initialLeave);
    setVacancies(buildVacancies());
    setNotifications(initialNotifications);
    setOpenSelfRosterShifts(initialOpenShifts);
    setClaimedShifts([]);
    setClaimedHours(0);
    setSyncLog(initialSyncLog);
    setAuditLog([]);
    setOptimisationRun(idleRun);
    try { sessionStorage.removeItem(DATA_KEY); } catch { /* ignore */ }
  };

  // ----- Exceptions: full lifecycle -----
  const submitException = (input: NewExceptionInput) => {
    const id = `ex${Date.now()}`;
    const item: ExceptionItem = {
      id, ...input, date: 'Today', status: 'Submitted', recommendation: null, toilTaken: false, penaltyAmount: null
    };
    setExceptions(prev => [item, ...prev]);
    log(`Submitted exception report (${input.type}) for ${input.staff}`);
    return id;
  };
  const advanceException = (id: string) => {
    setExceptions(prev => prev.map(e => {
      if (e.id !== id) return e;
      if (e.status === 'Submitted') { log(`Validated exception ${id} against rota rules`); return { ...e, status: 'Validated' }; }
      if (e.status === 'Validated') { log(`Sent exception ${id} to Guardian of Safe Working Hours for review`); return { ...e, status: 'Manager Review' }; }
      return e;
    }));
  };
  const approveException = (id: string, recommendation: 'TOIL' | 'Reimbursement' | 'No action') => {
    setExceptions(prev => prev.map(e => {
      if (e.id !== id) return e;
      const penalty = recommendation === 'Reimbursement' ? Math.round(4 * 21.15 * 100) / 100 : null;
      log(`Approved exception ${id} \u2014 recommendation: ${recommendation}`);
      return { ...e, status: 'Approved', recommendation, penaltyAmount: penalty };
    }));
  };
  const escalateException = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'Escalated' } : e));
    log(`Escalated exception ${id} \u2014 immediate patient-safety concern`);
  };
  const closeException = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'Closed' } : e));
    log(`Closed exception ${id}`);
  };
  const reopenException = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'Manager Review' } : e));
    log(`Reopened exception ${id} for further review`);
  };

  // ----- Leave -----
  const requestLeave = (input: NewLeaveInput) => {
    const id = `lv${Date.now()}`;
    setLeaveRequests(prev => [{ id, ...input, status: 'Pending' }, ...prev]);
    log(`Requested ${input.type} (${input.dates}) for ${input.staff}${input.withinSixWeeks ? ' \u2014 routed to manual approval (inside 6-week window)' : ''}`);
  };
  const approveLeave = (id: string) => { setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l)); log(`Approved leave request ${id}`); };
  const declineLeave = (id: string) => { setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'Declined' } : l)); log(`Declined leave request ${id}`); };

  // ----- Vacancies -----
  const postVacancy = (department: string, date: string, shiftType: string) => {
    const id = `vc${Date.now()}`;
    setVacancies(prev => [{ id, department, date, shiftType, status: 'Open', source: 'Cascade' }, ...prev]);
    log(`Vacancy posted: ${shiftType}, ${department}, ${date} \u2014 cascaded to eligible staff automatically`);
  };
  const fillVacancy = (id: string) => { setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: 'Filled' } : v)); log(`Vacancy ${id} filled`); };
  const cancelVacancy = (id: string) => { setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: 'Cancelled' } : v)); log(`Vacancy ${id} cancelled`); };

  // ----- Self-rostering: the pass/fail-critical flow -----
  const claimShift = (id: string): { ok: true } | { ok: false; reason: string; alternativeId?: string } => {
    const shift = openSelfRosterShifts.find(s => s.id === id);
    if (!shift) return { ok: false, reason: 'Shift no longer available.' };
    if (!shift.compliant) {
      log(`Blocked self-roster attempt on ${shift.date} \u2014 ${shift.breachReason}`);
      return { ok: false, reason: shift.breachReason ?? 'This shift would breach a contractual rule.', alternativeId: shift.alternativeId };
    }
    setOpenSelfRosterShifts(prev => prev.filter(s => s.id !== id));
    setClaimedShifts(prev => [...prev, shift]);
    setClaimedHours(prev => prev + shift.hours);
    log(`Self-rostered onto ${shift.date} ${shift.time} (${shift.department}) \u2014 compliance check passed`);
    return { ok: true };
  };

  // ----- Rota optimisation run -----
  const runOptimisation = () => {
    setOptimisationRun({ ...idleRun, status: 'running' });
    log('Started rota optimisation run against current constraints (EWTD, 2016/2019 TCS, LTFT patterns, staff preferences)');
    window.setTimeout(() => {
      setOptimisationRun({
        status: 'done',
        gapsBefore: 14,
        gapsAfter: 1,
        fillRatePct: 96.8,
        remainingGaps: [{ shift: 'Sat 5 Sep, Night, General Surgery', reason: 'No compliant clinician available within 11-hour rest-period rules' }]
      });
      log('Optimisation run complete \u2014 96.8% vacancy fill rate, 0 compliance breaches');
    }, 1400);
  };

  // ----- ESR integration -----
  const simulateEsrNewStarter = () => {
    setSyncLog(prev => [{
      id: `sl${Date.now()}`, time: 'just now',
      event: 'New starter received from ESR', detail: 'Dr. Farah Iqbal \u2014 ST3 Registrar, Trauma & Orthopaedics \u2014 fully configured, ready to schedule (latency 4.2s)',
      direction: 'ESR \u2192 PCL One'
    }, ...prev]);
    log('New starter Dr. Farah Iqbal auto-provisioned from ESR feed \u2014 no manual data entry');
  };

  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const pendingExceptions = exceptions.filter(e => e.status !== 'Closed').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const openShifts = vacancies.filter(v => v.status === 'Open').length;
  const notifCount = notifications.filter(n => !n.read).length;

  return (
    <StoreContext.Provider value={{
      currentUser, trust, pendingExceptions, pendingLeaves, openShifts, nextPublishDate: '24 Oct 2026',
      login, logout, setTrust,
      exceptions, submitException, advanceException, approveException, escalateException, closeException, reopenException,
      leaveRequests, requestLeave, approveLeave, declineLeave,
      vacancies, postVacancy, fillVacancy, cancelVacancy,
      openSelfRosterShifts, claimedShifts, claimedHours, claimShift,
      optimisationRun, runOptimisation,
      syncLog, simulateEsrNewStarter,
      auditLog,
      notifications, notifCount, markAllNotificationsRead
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
