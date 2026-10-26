import { useState, type ReactNode } from 'react';

/* ─── Section Card ─── */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-navy-700 bg-navy-900/80 backdrop-blur-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Info / Warning / Success Callout ─── */
type Tone = 'info' | 'warn' | 'success' | 'error';
const toneStyles: Record<Tone, string> = {
  info: 'border-cyan-600/40 bg-cyan-950/30 text-cyan-300',
  warn: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
  success: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
  error: 'border-red-500/40 bg-red-950/30 text-red-300',
};
const toneIcons: Record<Tone, string> = { info: 'ℹ️', warn: '⚠️', success: '✅', error: '❌' };

export function Callout({ tone = 'info', title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${toneStyles[tone]}`}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-base">{toneIcons[tone]}</span>
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Code Block ─── */
export function CodeBlock({ language, children }: { language?: string; children: string }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-charcoal-900 overflow-x-auto">
      {language && (
        <div className="border-b border-navy-700 px-4 py-1.5 text-xs font-mono text-slate-500 uppercase tracking-wider">
          {language}
        </div>
      )}
      <pre className="p-4 text-sm font-mono text-cyan-300 leading-relaxed whitespace-pre-wrap break-all">
        {children}
      </pre>
    </div>
  );
}

/* ─── HTTP Request/Response Block ─── */
export function HttpBlock({ method, url, body, response, status }: {
  method: string; url: string; body?: string; response: string; status: number;
}) {
  const statusColor = status >= 200 && status < 300 ? 'text-emerald-400' : 'text-red-400';
  return (
    <div className="rounded-lg border border-navy-700 bg-charcoal-900 overflow-hidden text-sm font-mono">
      <div className="border-b border-navy-700 px-4 py-2 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-400 text-xs font-bold">{method}</span>
        <span className="text-slate-400">{url}</span>
        <span className={`ml-auto font-bold ${statusColor}`}>{status}</span>
      </div>
      {body && (
        <div className="border-b border-navy-700 px-4 py-2">
          <p className="text-xs text-slate-500 mb-1">Request Body</p>
          <pre className="text-amber-300 whitespace-pre-wrap break-all">{body}</pre>
        </div>
      )}
      <div className="px-4 py-2">
        <p className="text-xs text-slate-500 mb-1">Response</p>
        <pre className={`whitespace-pre-wrap break-all ${status >= 200 && status < 300 ? 'text-emerald-300' : 'text-red-300'}`}>
          {response}
        </pre>
      </div>
    </div>
  );
}

/* ─── Show/Hide Explanation Toggle ─── */
export function RevealBlock({ label = 'Show explanation', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium group"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-cyan-600/50 text-xs group-hover:bg-cyan-900/30 transition-colors">▶</span>
          {label}
        </button>
      ) : (
        <div className="animate-fade-in-up">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-400 transition-colors font-medium mb-3"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-slate-600/50 text-xs">▼</span>
            Hide explanation
          </button>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Simulated Terminal ─── */
export function Terminal({ lines }: { lines: { type: 'input' | 'output' | 'error' | 'success'; text: string }[] }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-charcoal-900 overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-navy-700 bg-charcoal-800">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-xs text-slate-500">Terminal</span>
      </div>
      <div className="p-4 space-y-1 max-h-64 overflow-y-auto">
        {lines.map((l, i) => (
          <div key={i} className={
            l.type === 'input' ? 'text-cyan-400' :
            l.type === 'error' ? 'text-red-400' :
            l.type === 'success' ? 'text-emerald-400' :
            'text-slate-400'
          }>
            {l.type === 'input' && <span className="text-emerald-500 mr-2">$</span>}
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Screenshot Placeholder ─── */
export function ScreenshotPlaceholder({ label, number }: { label: string; number: number }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-navy-600 bg-navy-900/50 p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
      <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl mb-3">📸</div>
      <p className="text-slate-400 font-medium text-sm">Evidence #{number}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
      <p className="text-xs text-navy-500 mt-3 italic">Replace with your own screenshot</p>
    </div>
  );
}

/* ─── Section Heading Inside Steps ─── */
export function SectionLabel({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 mt-8 mb-3 first:mt-0">
      <span>{icon}</span>{children}
    </h3>
  );
}

/* ─── Badge ─── */
export function Badge({ children, color = 'cyan' }: { children: ReactNode; color?: 'cyan' | 'emerald' | 'red' | 'amber' }) {
  const styles = {
    cyan: 'bg-cyan-900/40 text-cyan-400 border-cyan-700/50',
    emerald: 'bg-emerald-900/40 text-emerald-400 border-emerald-700/50',
    red: 'bg-red-900/40 text-red-400 border-red-700/50',
    amber: 'bg-amber-900/40 text-amber-400 border-amber-700/50',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[color]}`}>
      {children}
    </span>
  );
}
