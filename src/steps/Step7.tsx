import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, HttpBlock, Badge } from '../components/ui';
import SimulatedCart from '../components/SimulatedCart';
import { formatEuro } from '../data';

interface SwapHistoryItem {
  step: number;
  code: string;
  percent: number;
  action: string;
  priceAfter: number;
  explanation: string;
}

export default function Step7() {
  const [history, setHistory] = useState<SwapHistoryItem[]>([]);
  const [lastCode, setLastCode] = useState<string | null>(null);

  // Progression sequence:
  // Initial: €666.00
  // 1. NIGHT20 (20% off 666) -> €532.80
  // 2. NEWS30 (30% off 666) -> €333.00 (cumulative 50%)
  // 3. NIGHT20 (swap back, +20%) -> €199.80 (cumulative 70%)
  // 4. NEWS30 (swap back, +30%) -> €0.00 (cumulative 100% discount!)
  const stepsData = [
    {
      code: 'NIGHT20',
      percent: 20,
      priceAfter: 53280,
      explanation: 'First coupon applied: 20% discount (€133.20 deducted). Price is €532.80.',
    },
    {
      code: 'NEWS30',
      percent: 30,
      priceAfter: 33300,
      explanation: 'Newsletter coupon applied: 30% added. Server stacks coupons without validation. Price is €333.00.',
    },
    {
      code: 'NIGHT20',
      percent: 20,
      priceAfter: 19980,
      explanation: 'Swapped back to NIGHT20! Since current active was NEWS30, the duplicate check passed! Price is €199.80.',
    },
    {
      code: 'NEWS30',
      percent: 30,
      priceAfter: 0,
      explanation: 'Swapped back to NEWS30! Total cumulative discount reaches 100%. Price reaches €0.00!',
    },
  ];

  const currentStepIndex = history.length;
  const isComplete = currentStepIndex >= 4;
  const nextTarget = !isComplete ? stepsData[currentStepIndex].code : null;

  const currentPrice = history.length === 0 ? 66600 : history[history.length - 1].priceAfter;

  const handleApply = (code: string) => {
    if (isComplete) return;

    if (code === lastCode) {
      alert(`The server rejects immediate duplicates of ${code}. You must alternate/swap to the other coupon!`);
      return;
    }

    if (code !== nextTarget) {
      alert(`To demonstrate the alternating swap sequence, apply ${nextTarget} next.`);
      return;
    }

    const nextData = stepsData[currentStepIndex];
    const newItem: SwapHistoryItem = {
      step: currentStepIndex + 1,
      code: nextData.code,
      percent: nextData.percent,
      action: `Apply ${nextData.code}`,
      priceAfter: nextData.priceAfter,
      explanation: nextData.explanation,
    };

    setHistory((prev) => [...prev, newItem]);
    setLastCode(code);
  };

  const handleReset = () => {
    setHistory([]);
    setLastCode(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        This is the <strong className="text-white">core discovery</strong> of the challenge.
        In Step 5, we observed that entering the <em>same</em> coupon consecutively was blocked (<code className="text-red-400">Coupon already applied</code>).
        However, what happens if we <strong className="text-cyan-400">swap / alternate back and forth</strong> between two different valid codes?
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        In applications with flawed state tracking, the server often only checks if the submitted code matches the
        <em> currently active coupon</em> or clears the validation flag when another coupon is processed.
        By alternating <code className="text-cyan-300">NIGHT20 → NEWS30 → NIGHT20 → NEWS30</code>, each coupon re-triggers the discount logic without proper historical deduplication.
      </Callout>

      <SectionLabel icon="🧪">Interactive Coupon Swapping Lab</SectionLabel>
      <p className="text-sm text-slate-400 mb-3">
        Follow the sequence by alternating between <span className="font-mono text-cyan-300">NIGHT20</span> and <span className="font-mono text-cyan-300">NEWS30</span> below.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Coupon Swap Controller</h4>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-navy-800 border border-navy-700"
              >
                ↺ Reset Swap
              </button>
            </div>

            <div className="p-3 bg-navy-950/80 rounded-lg border border-navy-800 text-xs mb-4 flex items-center justify-between">
              <span className="text-slate-400">Target Sequence:</span>
              <div className="font-mono flex items-center gap-1.5 font-bold">
                <span className={history.length >= 1 ? 'text-emerald-400 line-through' : 'text-cyan-400'}>NIGHT20</span>
                <span className="text-slate-600">→</span>
                <span className={history.length >= 2 ? 'text-emerald-400 line-through' : history.length === 1 ? 'text-cyan-400' : 'text-slate-500'}>NEWS30</span>
                <span className="text-slate-600">→</span>
                <span className={history.length >= 3 ? 'text-emerald-400 line-through' : history.length === 2 ? 'text-cyan-400' : 'text-slate-500'}>NIGHT20</span>
                <span className="text-slate-600">→</span>
                <span className={history.length >= 4 ? 'text-emerald-400 line-through' : history.length === 3 ? 'text-cyan-400' : 'text-slate-500'}>NEWS30</span>
              </div>
            </div>

            {/* Buttons to swap */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleApply('NIGHT20')}
                disabled={isComplete || nextTarget !== 'NIGHT20'}
                className={`py-3 px-4 rounded-lg font-mono font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                  nextTarget === 'NIGHT20'
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/40 ring-2 ring-cyan-400/60'
                    : 'bg-navy-800 text-slate-600 border border-navy-700 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Apply NIGHT20</span>
                <span className="text-[10px] font-sans font-normal opacity-80">(20% Discount)</span>
              </button>

              <button
                onClick={() => handleApply('NEWS30')}
                disabled={isComplete || nextTarget !== 'NEWS30'}
                className={`py-3 px-4 rounded-lg font-mono font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                  nextTarget === 'NEWS30'
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40 ring-2 ring-teal-400/60'
                    : 'bg-navy-800 text-slate-600 border border-navy-700 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Apply NEWS30</span>
                <span className="text-[10px] font-sans font-normal opacity-80">(30% Discount)</span>
              </button>
            </div>

            {/* Price Meter */}
            <div className="p-4 bg-navy-950 rounded-xl border border-navy-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-mono">Current Cart Total</span>
                <span className={`text-2xl font-bold font-mono ${currentPrice === 0 ? 'text-emerald-400 animate-pulse' : currentPrice <= 6600 ? 'text-cyan-300' : 'text-rose-400'}`}>
                  {formatEuro(currentPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block uppercase font-mono">Store Credit</span>
                <span className="text-sm font-bold font-mono text-emerald-400">€66.00</span>
              </div>
            </div>
          </Card>

          {/* History Log */}
          {history.length > 0 && (
            <div className="space-y-2 animate-fade-in-up">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Alternation History</h5>
              <div className="space-y-2">
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-navy-900/90 rounded-lg border border-navy-700 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono font-bold">
                        {h.step}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-white mr-2">{h.code}</span>
                        <span className="text-slate-400">{h.explanation}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-cyan-300 whitespace-nowrap ml-2">
                      {formatEuro(h.priceAfter)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Cart Preview */}
        <SimulatedCart
          coupons={history.map((h, i) => ({
            code: `${h.code} (swap #${i + 1})`,
            percent: h.percent,
            appliedAt: 7,
          }))}
          showCheckout
        />
      </div>

      {isComplete && (
        <div className="space-y-4 animate-fade-in-up">
          <HttpBlock
            method="POST"
            url="/api/cart/coupon"
            body={`{"code": "NEWS30"}`}
            status={200}
            response={`{
  "ok": true,
  "cart": {
    "subtotal": 66600,
    "discount": 66600,
    "total": 0,
    "credit": 6600,
    "canCheckout": true,
    "message": "Cart total fully discounted to €0.00."
  }
}`}
          />
        </div>
      )}

      {/* Comparison: Expected vs Observed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-red-400">❌</span>
            <h5 className="font-bold text-red-300 text-sm">Expected E-Commerce Behavior</h5>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Applying a new coupon should either <strong>replace</strong> the previous coupon or enforce a strict single-use policy per session.</li>
            <li>Coupons already redeemed during the cart lifecycle must remain recorded in a blacklist set.</li>
            <li>The final price should always recompute authoritatively from base price without unconstrained discount accumulation.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">⚠️</span>
            <h5 className="font-bold text-emerald-300 text-sm">Observed Challenge Behavior</h5>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>The server only checked whether the submitted code matched the <em>immediately preceding coupon</em>.</li>
            <li>Swapping to another valid code (<code className="text-cyan-300 font-mono">NEWS30</code>) cleared the restriction on the first code (<code className="text-cyan-300 font-mono">NIGHT20</code>).</li>
            <li>Alternating back and forth repeatedly applied discounts until the total payable hit <strong>€0.00</strong>.</li>
          </ul>
        </div>
      </div>

      {isComplete && (
        <RevealBlock label="Show explanation">
          <div className="space-y-4">
            <Callout tone="success" title="The Discovery: State Invalidation via Alternation">
              <p>
                By simply alternating between the two discovered promotion codes, we bypassed the single-use check completely without needing any concurrency exploits or external tools!
              </p>
              <p className="mt-2 text-slate-300">
                The price is now <strong className="text-emerald-400 font-mono">€0.00</strong>, which is well within our <strong className="text-white">€66.00 credit</strong>, unlocking the checkout button!
              </p>
            </Callout>

            <SectionLabel icon="🔑">Security takeaway</SectionLabel>
            <p className="text-sm text-slate-400 leading-relaxed">
              Business rules must track state <strong className="text-slate-200">globally across the entire session lifecycle</strong>, not merely against the most recent request.
              Always store redeemed coupons in an immutable session set and recalculate all discounts directly from trusted base amounts.
            </p>
          </div>
        </RevealBlock>
      )}
    </div>
  );
}
