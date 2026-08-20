import { Calendar, Brain, UserCircle, Plane, AlertCircle, Stethoscope, Link2, Smartphone, Briefcase, BarChart, Settings } from 'lucide-react';

export interface ModuleDef {
  name: string;
  path: string;
  icon: typeof Calendar;
  blurb: string;
}

export const modules: ModuleDef[] = [
  { name: 'Medical & Dental Workforce Scheduling', path: '/scheduling', icon: Calendar, blurb: 'Build and manage rotas across every specialty' },
  { name: 'Workforce Optimisation', path: '/optimisation', icon: Brain, blurb: 'Automated rota optimisation against constraints & rules' },
  { name: 'Self-Rostering', path: '/selfroster', icon: UserCircle, blurb: 'Autonomous self-rostering within contract confines' },
  { name: 'Time, Leave & Attendance', path: '/leave', icon: Plane, blurb: 'Annual, study & sickness leave, WTE-aware' },
  { name: 'Compliance & Exception Management', path: '/exceptions', icon: AlertCircle, blurb: 'Guardian of Safe Working Hours exception lifecycle' },
  { name: 'Theatre & Anaesthetics', path: '/theatre', icon: Stethoscope, blurb: 'Session allocation & supervision visibility' },
  { name: 'Integration Hub / API', path: '/integrations', icon: Link2, blurb: 'ESR, LP2, Agile Workforce & Deanery interfaces' },
  { name: 'Mobile Workforce', path: '/mobile', icon: Smartphone, blurb: 'Roster, leave, swaps & exceptions on the go' },
  { name: 'Vacancy & Temporary Workforce', path: '/vacancies', icon: Briefcase, blurb: 'Open shifts, cascade & locum/bank visibility' },
  { name: 'Workforce Analytics', path: '/analytics', icon: BarChart, blurb: 'The Trusts\u2019 own 8 contract KPIs, live' },
  { name: 'Admin & Security', path: '/admin', icon: Settings, blurb: 'Accounts, audit trail, DTAC & compliance' }
];
