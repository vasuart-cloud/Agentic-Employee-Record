import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const toneStyles =
          toast.tone === 'success'
            ? 'bg-emerald-950 text-white border-emerald-700'
            : toast.tone === 'warning'
            ? 'bg-amber-950 text-white border-amber-700'
            : toast.tone === 'error'
            ? 'bg-rose-950 text-white border-rose-700'
            : 'bg-slate-900 text-white border-slate-700';

        const Icon =
          toast.tone === 'success'
            ? CheckCircle2
            : toast.tone === 'warning'
            ? AlertTriangle
            : toast.tone === 'error'
            ? AlertOctagon
            : Info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border shadow-lg text-xs ${toneStyles}`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="opacity-70 hover:opacity-100 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
