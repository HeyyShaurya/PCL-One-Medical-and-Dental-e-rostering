import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { modules } from '../modules';

export default function Layout() {
  const { currentUser, trust, setTrust, notifCount, notifications, markAllNotificationsRead, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecting must happen as a side-effect, never during render, or React Router
  // logs a warning and the redirect can silently fail — leaving a blank screen.
  useEffect(() => {
    if (!currentUser) navigate('/', { replace: true });
  }, [currentUser, navigate]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchQuery('');
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  if (!currentUser) return null;

  const initials = currentUser.name.split(' ').map(n => n[0]).join('');

  const handleTrustSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => setTrust(e.target.value);
  const handleLogout = () => { logout(); navigate('/'); };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return modules.filter(m => m.name.toLowerCase().includes(q) || m.blurb.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 bg-pcl-blue text-white flex items-center gap-4 px-4 shadow-sm relative z-30">
        <button
          className="text-2xl leading-none px-2 hover:bg-white/10 rounded"
          aria-label="Menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(o => !o)}
        >☰</button>
        <Link to="/home" className="flex items-center gap-2 ml-1 hover:opacity-90 transition-opacity">
          <span className="text-xl font-extrabold tracking-tight">PCL One</span>
          <span className="text-xs font-medium opacity-90 hidden sm:inline ml-1 border-l border-white/25 pl-3">Medical &amp; Dental e-Rostering</span>
        </Link>
        <div className="w-px h-6 bg-white/25 mx-2 hidden md:block" />

        <select
          value={trust}
          onChange={handleTrustSwitch}
          className="bg-white/10 border border-white/25 rounded-sm text-sm px-2 py-1.5 text-white outline-none focus:border-white/50 hover:bg-white/20 transition-colors hidden md:block cursor-pointer"
        >
          <option value="Rotherham" className="text-pcl-ink bg-white">The Rotherham NHS Foundation Trust</option>
          <option value="Barnsley" className="text-pcl-ink bg-white">Barnsley Hospital NHS Foundation Trust</option>
        </select>

        <div className="flex-1 flex justify-center relative" ref={searchRef}>
          <div className="w-full max-w-[420px] h-10 md:h-[36px] bg-white rounded-sm flex items-center px-3 shadow-inner">
            <span className="text-pcl-blue text-lg mb-0.5">⌕</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 ml-2 text-sm italic outline-none border-0 text-pcl-ink bg-transparent"
              placeholder="Search people, rotas, exceptions…"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full max-w-[420px] bg-white text-pcl-ink border border-line shadow-lg z-40">
              {searchResults.map(m => (
                <Link
                  key={m.path}
                  to={m.path}
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#f4f1ef] not-italic"
                >
                  <m.icon className="w-4 h-4 text-pcl-blue flex-shrink-0" />
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-pcl-muted">{m.blurb}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xl">
          <div className="relative" ref={notifRef}>
            <button
              className="relative hover:opacity-80 transition-opacity"
              aria-label="Notifications"
              onClick={() => setNotifOpen(o => !o)}
            >
              ♢<span className="absolute -top-1.5 -right-2 bg-[#d75b12] text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none shadow-sm">{notifCount}</span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white text-pcl-ink border border-line shadow-lg z-40 text-sm">
                <div className="pcl-panel-header !h-10 !px-3">
                  <span className="text-xs font-bold uppercase tracking-wide">Notifications</span>
                  <button onClick={markAllNotificationsRead} className="text-xs text-pcl-blue hover:underline font-normal">Mark all read</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex gap-2 px-3 py-2.5 border-b border-line ${n.read ? 'opacity-60' : ''}`}>
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-pcl-blue'}`} />
                      <div>
                        <div>{n.text}</div>
                        <div className="text-xs text-pcl-muted mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="w-8 h-8 rounded-sm border border-white/50 flex items-center justify-center text-[13px] font-bold cursor-pointer hover:opacity-90 shadow-sm flex-shrink-0"
            style={{ background: "linear-gradient(#f3cab1,#fff)", color: "#302b28" }}
            onClick={handleLogout}
            title={`${currentUser.name} (Click to sign out)`}
          >
            {initials}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-3 px-6 border-t border-line bg-white text-[12px] text-pcl-muted flex flex-col md:flex-row justify-between gap-2 mt-auto">
        <span>PCL One — illustrative product demonstration</span>
        <span>The Rotherham NHS Foundation Trust &amp; Barnsley Hospital NHS Foundation Trust · Ref. C462428</span>
      </footer>

      {/* Off-canvas module drawer opened via the hamburger — not a persistent sidebar */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[300px] max-w-[85vw] h-full bg-white shadow-xl flex flex-col">
            <div className="h-16 bg-pcl-blue text-white flex items-center justify-between px-4">
              <span className="text-lg font-extrabold tracking-tight">PCL One</span>
              <button aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/home"
              onClick={() => setDrawerOpen(false)}
              className="px-5 py-3 text-sm font-semibold text-pcl-ink border-b border-line hover:bg-[#f4f1ef]"
            >
              Home
            </Link>
            <div className="overflow-y-auto flex-1">
              {modules.map(m => (
                <Link
                  key={m.path}
                  to={m.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm border-b border-line hover:bg-[#f4f1ef] ${location.pathname === m.path ? 'text-pcl-blue font-semibold' : 'text-pcl-ink'}`}
                >
                  <m.icon className="w-4 h-4" />
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
