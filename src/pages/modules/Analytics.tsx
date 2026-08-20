import { useStore, KPI_TILES } from '../../store';

const fillRateByDept = [
  { dept: 'Cardiology', rate: 96 },
  { dept: 'A&E', rate: 88 },
  { dept: 'General Surgery', rate: 91 },
  { dept: 'Medicine', rate: 94 },
  { dept: 'Paediatrics', rate: 85 },
  { dept: 'Anaesthetics', rate: 97 },
];

function barColor(rate: number) {
  if (rate >= 95) return 'var(--color-status-green)';
  if (rate >= 90) return 'var(--color-status-amber)';
  return 'var(--color-status-red)';
}

function statusClass(status: 'Green' | 'Amber' | 'Red') {
  if (status === 'Green') return 'status-green';
  if (status === 'Amber') return 'status-amber';
  return 'status-red';
}

function Sparkline({ points, status }: { points: number[]; status: 'Green' | 'Amber' | 'Red' }) {
  const color = status === 'Green' ? 'var(--color-status-green)' : status === 'Amber' ? 'var(--color-status-amber)' : 'var(--color-status-red)';
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const w = 100, h = 28;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

export default function Analytics() {
  const { pendingExceptions, pendingLeaves, openShifts } = useStore();

  return (
    <div className="p-6 max-w-[1040px] mx-auto space-y-6">
      <h1 className="text-2xl font-light mb-1">Workforce Analytics</h1>
      <p className="text-sm text-pcl-muted -mt-1">Tracked against the Trusts&rsquo; own contract KPIs (Appendix A), not a generic dashboard.</p>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>Contract KPI dashboard \u2014 KPIs 1\u20138, RAG status</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
          {KPI_TILES.map(k => (
            <div key={k.id} className="bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-pcl-ink">{k.name}</div>
                  <div className="text-[22px] font-light tabular-nums mt-1">{k.value}</div>
                  <div className="text-xs text-pcl-muted mt-0.5">Target: {k.target}</div>
                </div>
                <span className={statusClass(k.status)}>{k.status}</span>
              </div>
              <div className="mt-3">
                <Sparkline points={k.trend} status={k.status} />
                <div className="text-[10px] text-pcl-muted mt-1">6-month trend, monthly reporting (legend: line colour = RAG status shown above)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="pcl-panel p-5 text-center">
          <div className="text-[30px] font-light text-pcl-blue tabular-nums">{openShifts}</div>
          <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Open shifts</div>
        </div>
        <div className="pcl-panel p-5 text-center">
          <div className="text-[30px] font-light text-pcl-blue tabular-nums">{pendingExceptions}</div>
          <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Open exceptions</div>
        </div>
        <div className="pcl-panel p-5 text-center">
          <div className="text-[30px] font-light text-pcl-blue tabular-nums">{pendingLeaves}</div>
          <div className="text-xs text-pcl-muted uppercase tracking-wide mt-1">Pending leave</div>
        </div>
      </div>

      <div className="pcl-panel">
        <div className="pcl-panel-header"><span>E-rostering fill rate by department</span></div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-xs text-pcl-muted">
            <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 inline-block" style={{ background: 'var(--color-status-green)' }} />&ge;95%</span>
            <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 inline-block" style={{ background: 'var(--color-status-amber)' }} />90&ndash;94%</span>
            <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 inline-block" style={{ background: 'var(--color-status-red)' }} />&lt;90%</span>
          </div>
          {fillRateByDept.map(d => (
            <div key={d.dept} className="flex items-center gap-4">
              <div className="w-[160px] text-sm text-pcl-ink flex-shrink-0">{d.dept}</div>
              <div className="flex-1 h-5 bg-[#f0ece9] relative">
                <div className="h-full" style={{ width: `${d.rate}%`, background: barColor(d.rate) }} />
              </div>
              <div className="w-10 text-sm tabular-nums text-right text-pcl-muted">{d.rate}%</div>
            </div>
          ))}
          <div className="text-[11px] text-pcl-muted pt-1">X axis: fill rate (%) per department, current rota period. Y axis: department.</div>
        </div>
      </div>
    </div>
  );
}
