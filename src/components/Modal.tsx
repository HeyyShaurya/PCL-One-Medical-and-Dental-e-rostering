import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white border border-line shadow-xl w-full max-w-[480px]">
        <div className="pcl-panel-header">
          <span>{title}</span>
          <button aria-label="Close" onClick={onClose} className="text-pcl-muted hover:text-pcl-ink">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 text-sm text-pcl-ink space-y-3">{children}</div>
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-pcl-charcoal text-white text-sm px-4 py-2.5 shadow-lg">
      {message}
    </div>
  );
}
