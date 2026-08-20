import { Link } from 'react-router-dom';
import { Calendar, Plane, AlertCircle } from 'lucide-react';
import { firstNameOf, useStore } from '../store';
import { modules } from '../modules';

export default function Home() {
  const { currentUser, trust, pendingExceptions, pendingLeaves, openShifts, nextPublishDate } = useStore();

  if (!currentUser) return null;

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const trustFullName = trust === 'Rotherham' ? 'The Rotherham NHS Foundation Trust' : 'Barnsley Hospital NHS Foundation Trust';

  return (
    <div className="relative min-h-[calc(100vh-64px-44px)] overflow-hidden" style={{ background: "var(--color-pcl-warm-bg)" }}>
      <div className="pointer-events-none absolute -left-24 -bottom-16 w-[340px] h-[520px] opacity-90"
           style={{ background: "radial-gradient(circle at 60% 68%, rgba(0,82,149,.22) 0 26%, transparent 27%), radial-gradient(circle at 28% 66%, rgba(253,187,48,.55) 0 19%, transparent 20%)", transform: "rotate(-8deg)" }} />
      <div className="pointer-events-none absolute -right-20 -bottom-32 w-[440px] h-[440px] opacity-90"
           style={{ background: "radial-gradient(circle at 74% 60%, rgba(141,198,63,.45) 0 34%, transparent 35%), radial-gradient(circle at 40% 48%, rgba(255,255,255,.75) 0 58%, transparent 59%)" }} />

      <div className="relative z-10 max-w-[1040px] mx-auto px-6 py-9">
        <h1 className="text-[30px] font-light mb-2">Good {timeOfDay}, {firstNameOf(currentUser.name)}</h1>
        <p className="text-pcl-muted mb-7">{trustFullName}</p>

        <div className="flex items-center gap-8 border-b-2 border-[#7e7e7e] h-[38px] mb-7 text-[#777] text-sm">
          <button className="border-b-[3px] border-[#222] text-[#222] pb-2 font-medium">My Workspace</button>
          <button className="pb-2 hover:text-[#222]">My Reporting</button>
          <span className="ml-auto text-2xl text-[#222] font-light">›</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-12">
          <div className="flex flex-col gap-5">
            <div className="text-xs font-bold uppercase tracking-wide mb-1 text-pcl-ink">Quick actions</div>
            <Link to="/scheduling" className="flex items-center gap-3 text-sm text-pcl-blue hover:underline text-left">
              <Calendar className="w-5 h-5 text-pcl-muted" /> View my upcoming shifts
            </Link>
            <Link to="/leave" className="flex items-center gap-3 text-sm text-pcl-blue hover:underline text-left">
              <Plane className="w-5 h-5 text-pcl-muted" /> Request annual leave
            </Link>
            <Link to="/exceptions" className="flex items-center gap-3 text-sm text-pcl-blue hover:underline text-left">
              <AlertCircle className="w-5 h-5 text-pcl-muted" /> Log an exception
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, 130px)" }}>
            {modules.map((m) => (
              <Link key={m.path} to={m.path}
                    className="h-[120px] w-[130px] bg-[#f0ece9] hover:bg-[#e7dfdb] hover:-translate-y-px transition-all flex flex-col items-center justify-center text-center gap-2 px-2 border border-transparent hover:border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <m.icon className="w-8 h-8" style={{ color: "var(--color-pcl-blue)", strokeWidth: 1.5 }} />
                <span className="text-[13px] text-[#4a403b] leading-tight font-medium">{m.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <h2 className="mt-14 mb-4 text-[22px] font-light">Things to review</h2>
        <div className="grid grid-cols-[190px_1fr] bg-white border border-line h-[190px]">
          <div className="border-r border-line flex flex-col items-center justify-center gap-2 text-[#7c7c7c]">
            <strong className="text-[34px] font-light tabular-nums" style={{ color: "#0070a1" }}>{pendingExceptions + pendingLeaves}</strong>
            <span className="text-xs">items awaiting action</span>
          </div>
          <div className="flex flex-col justify-center gap-3 px-6 text-sm">
            <Link to="/vacancies" className="hover:underline w-fit"><strong className="font-semibold text-pcl-ink">{openShifts}</strong> open shifts across all departments</Link>
            <Link to="/exceptions" className="hover:underline w-fit"><strong className="font-semibold text-pcl-ink">{pendingExceptions}</strong> exception reports awaiting Guardian review</Link>
            <Link to="/leave" className="hover:underline w-fit"><strong className="font-semibold text-pcl-ink">{pendingLeaves}</strong> leave requests pending manual approval</Link>
            <div className="mt-1 text-pcl-muted">Next rota publishes <strong className="text-pcl-ink">{nextPublishDate}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
