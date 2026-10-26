import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock } from '../components/ui';
import SimulatedCart from '../components/SimulatedCart';

export default function Step4() {
  const [applied, setApplied] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleApply = () => {
    if (inputValue.toUpperCase() === 'NIGHT20') {
      setApplied(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        The store's announcement banner mentions a promotional code: <code className="bg-navy-700 px-1.5 py-0.5 rounded text-cyan-400 text-xs font-mono">NIGHT20</code> for
        20% off The Midnight Collection. Let's apply it and observe how the discount system works.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        Understanding how the coupon system behaves with a <strong>valid code</strong> is essential before
        testing for flaws. We need to know: How much does it discount? What does the response look like?
        What state does the server maintain?
      </Callout>

      <SectionLabel icon="🧪">Try it yourself</SectionLabel>
      <p className="text-sm text-slate-400 mb-3">
        Type <code className="bg-navy-700 px-1.5 py-0.5 rounded text-cyan-400 text-xs">NIGHT20</code> in the
        coupon field and click Apply.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h4 className="font-semibold text-white mb-4">Apply Promotion Code</h4>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter coupon code..."
              disabled={applied}
              className="flex-1 bg-charcoal-800 border border-navy-600 rounded px-3 py-2 text-sm font-mono text-slate-300 placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
            <button
              onClick={handleApply}
              disabled={applied || !inputValue.trim()}
              className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                applied
                  ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                  : !inputValue.trim()
                  ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {applied ? '✓ Applied' : 'Apply'}
            </button>
          </div>
          {applied && (
            <p className="text-sm text-emerald-400 mt-3 animate-fade-in-up">20% promotion applied successfully.</p>
          )}
          {!applied && inputValue.trim() && inputValue.toUpperCase() !== 'NIGHT20' && (
            <p className="text-sm text-red-400 mt-3">Try the code mentioned in the store's announcement banner.</p>
          )}

          {applied && (
            <div className="mt-6 space-y-3 animate-fade-in-up">
              <h4 className="text-sm font-semibold text-slate-300">Coupon History</h4>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-navy-800 border border-navy-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-mono text-emerald-400">NIGHT20</span>
                <span className="text-xs text-slate-500 ml-auto">20% off — Applied</span>
              </div>
            </div>
          )}
        </Card>

        <SimulatedCart
          coupons={applied ? [{ code: 'NIGHT20', percent: 20, appliedAt: 4 }] : []}
          showCheckout
        />
      </div>

      {applied && (
        <RevealBlock label="Show explanation">
          <div className="space-y-4">
            <Callout tone="warn" title="Discount applied, but not enough">
              <p>
                With NIGHT20 (20% off), the price drops from <strong>€666.00</strong> to <strong>€532.80</strong>.
                That's still far above our <strong>€66.00</strong> credit.
              </p>
              <p className="mt-2">
                A single valid coupon is expected behavior — not a vulnerability. But it raises important questions:
              </p>
            </Callout>

            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">?</span>
                <p>Can this coupon be applied <strong className="text-slate-200">more than once</strong>?</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">?</span>
                <p>Are there <strong className="text-slate-200">other coupon codes</strong> available?</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">?</span>
                <p>Can multiple coupons be <strong className="text-slate-200">stacked</strong> together?</p>
              </div>
            </div>

            <SectionLabel icon="🔑">Security takeaway</SectionLabel>
            <p className="text-sm text-slate-400 leading-relaxed">
              Applying a single coupon successfully tells us the discount mechanism is functional.
              The next step is to test its <strong className="text-slate-200">boundaries</strong>: reuse,
              stacking, and interaction with other features.
            </p>
          </div>
        </RevealBlock>
      )}
    </div>
  );
}
