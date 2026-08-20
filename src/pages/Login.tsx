import { useNavigate } from 'react-router-dom';
import { PERSONAS, useStore } from '../store';

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white">
      <div className="h-[190px] bg-pcl-charcoal text-white flex items-center justify-center">
        <div className="w-[380px] font-serif text-[28px] leading-tight font-bold text-center">
          Sign In<br />Medical &amp; Dental e-Rostering
        </div>
      </div>
      {/* the signature accent stripe */}
      <div
        className="h-[10px]"
        style={{
          background:
            "linear-gradient(120deg, #003e70 0 12%, #005295 12% 32%, #fdbb30 32% 48%, #8dc63f 48% 64%, #302b28 64% 80%, #fdbb30 80% 100%)",
        }}
      />
      <div className="max-w-3xl mx-auto mt-12 px-6">
        <p className="text-center text-pcl-muted mb-8 text-sm">Select a user to continue the demonstration</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => { login(p); navigate('/home'); }}
              className="bg-white border border-line p-4 hover:-translate-y-px transition-all flex items-center gap-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-pcl-blue text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-pcl-ink truncate">{p.name}</div>
                <div className="text-xs text-pcl-muted truncate">{p.role}</div>
                <div className="text-xs text-pcl-blue-dark truncate">{p.dept}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute left-[8%] right-[8%] bottom-8 border-t border-[#ccc] pt-2 text-[11px] text-pcl-muted flex justify-between">
        <span>The Rotherham NHS Foundation Trust &amp; Barnsley Hospital NHS Foundation Trust</span>
        <span className="font-bold tracking-tight text-pcl-charcoal">PCL One</span>
      </div>
    </div>
  );
}
