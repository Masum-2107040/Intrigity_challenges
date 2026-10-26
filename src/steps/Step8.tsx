import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, CodeBlock, Badge } from '../components/ui';

export default function Step8() {
  const [activeTab, setActiveTab] = useState<'state' | 'code'>('state');
  const [activeStep, setActiveStep] = useState(0);

  const swapStateSteps = [
    {
      action: 'Initial Cart',
      cartState: '{ lastCoupon: null, total: 66600, discount: 0 }',
      validation: 'No coupon applied yet.',
      vulnerabilityNote: 'Cart starts with normal price of €666.00.',
    },
    {
      action: '1. User applies NIGHT20',
      cartState: '{ lastCoupon: "NIGHT20", total: 53280, discount: 13320 }',
      validation: 'Check: Is input == lastCoupon? (NIGHT20 == null -> False). ALLOWED.',
      vulnerabilityNote: '20% discount applied. lastCoupon updated to "NIGHT20".',
    },
    {
      action: '2. User tries NIGHT20 again',
      cartState: '{ lastCoupon: "NIGHT20", total: 53280, discount: 13320 }',
      validation: 'Check: Is input == lastCoupon? (NIGHT20 == "NIGHT20" -> True). REJECTED (409).',
      vulnerabilityNote: 'Immediate duplicate is rejected because lastCoupon matches.',
    },
    {
      action: '3. User applies NEWS30 (Swap 1)',
      cartState: '{ lastCoupon: "NEWS30", total: 33300, discount: 33300 }',
      validation: 'Check: Is input == lastCoupon? (NEWS30 == "NIGHT20" -> False). ALLOWED.',
      vulnerabilityNote: 'lastCoupon is overwritten to "NEWS30"! History of NIGHT20 is forgotten!',
    },
    {
      action: '4. User applies NIGHT20 again (Swap 2)',
      cartState: '{ lastCoupon: "NIGHT20", total: 19980, discount: 46620 }',
      validation: 'Check: Is input == lastCoupon? (NIGHT20 == "NEWS30" -> False). ALLOWED!',
      vulnerabilityNote: 'Because lastCoupon is "NEWS30", NIGHT20 is accepted again! The loop continues.',
    },
    {
      action: '5. User applies NEWS30 again (Swap 3)',
      cartState: '{ lastCoupon: "NEWS30", total: 0, discount: 66600 }',
      validation: 'Check: Is input == lastCoupon? (NEWS30 == "NIGHT20" -> False). ALLOWED!',
      vulnerabilityNote: 'Final total drops to €0.00! Free order unlocked.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        We analyze the <strong className="text-white">business logic flaw</strong> that allows coupon alternating to repeatedly reduce the cart total.
        We dissect how state validation between different coupon codes broke down and why the server failed to preserve an authoritative pricing model.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        Security researchers must distinguish between what is observed and <em>why</em> it happens.
        Rather than assuming complex technical exploits like race conditions, we look directly at the simplest architectural explanation:
        <strong> naive state tracking</strong> and <strong>flawed discount recalculation</strong>.
      </Callout>

      <SectionLabel icon="🧠">Deconstructing the Flaw</SectionLabel>

      {/* Tabs */}
      <div className="flex border-b border-navy-700 gap-4 mb-4">
        <button
          onClick={() => setActiveTab('state')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'state'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🔄 State Machine Failure Walkthrough
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'code'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          💻 Vulnerable Logic Implementation
        </button>
      </div>

      {activeTab === 'state' ? (
        <Card className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white">How the Server Tracks State</h4>
              <p className="text-xs text-slate-400">Step through each action to see how the single variable <code className="text-cyan-300 font-mono">lastCoupon</code> creates an exploitable loop.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                disabled={activeStep === 0}
                className="px-3 py-1.5 rounded bg-navy-800 border border-navy-700 text-xs text-slate-300 disabled:opacity-40 hover:bg-navy-700"
              >
                ◀ Prev
              </button>
              <span className="font-mono text-xs text-cyan-400 px-2">
                Step {activeStep + 1} of {swapStateSteps.length}
              </span>
              <button
                onClick={() => setActiveStep((p) => Math.min(swapStateSteps.length - 1, p + 1))}
                disabled={activeStep === swapStateSteps.length - 1}
                className="px-3 py-1.5 rounded bg-navy-800 border border-navy-700 text-xs text-slate-300 disabled:opacity-40 hover:bg-navy-700"
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {swapStateSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-2 rounded border text-left text-xs transition-all ${
                  activeStep === idx
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 ring-1 ring-cyan-500'
                    : idx < activeStep
                    ? 'border-emerald-800/50 bg-emerald-950/20 text-emerald-400'
                    : 'border-navy-800 bg-navy-950/40 text-slate-500'
                }`}
              >
                <div className="font-bold truncate text-[11px]">Step {idx}</div>
                <div className="text-[10px] text-slate-400 truncate">{step.action.replace(/^\d+\.\s*/, '')}</div>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <span className="text-slate-500 block uppercase font-sans font-semibold">User Action</span>
              <div className="text-white font-bold text-sm">{swapStateSteps[activeStep].action}</div>
              <span className="text-slate-500 block uppercase font-sans font-semibold pt-2">Server Validation Check</span>
              <div className="text-amber-300 bg-charcoal-900 p-2.5 rounded border border-navy-700">
                {swapStateSteps[activeStep].validation}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <span className="text-slate-500 block uppercase font-sans font-semibold">Backend Session State</span>
              <div className="text-cyan-300 bg-charcoal-900 p-2.5 rounded border border-navy-700">
                {swapStateSteps[activeStep].cartState}
              </div>
              <span className="text-slate-500 block uppercase font-sans font-semibold pt-2">Analysis</span>
              <div className="text-slate-300 font-sans text-xs">
                {swapStateSteps[activeStep].vulnerabilityNote}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-1">Vulnerable Cart Handler (Pseudocode)</h4>
            <p className="text-xs text-slate-400 mb-3">Notice how checking only the last applied code allows infinite alternation.</p>
          </div>
          <CodeBlock language="typescript">
{`// Vulnerable Coupon Handler
app.post('/api/cart/coupon', (req, res) => {
  const { code } = req.body;
  const cart = getSessionCart(req.session.id);

  // FLAW 1: Naive check against only the immediately preceding code
  if (cart.lastAppliedCoupon === code) {
    return res.status(409).json({ error: "Coupon already applied" });
  }

  // FLAW 2: Discount is subtracted cumulatively without resetting base price
  const discountPercent = COUPON_REGISTRY[code];
  const discountAmount = Math.round(cart.subtotal * (discountPercent / 100));

  cart.discount += discountAmount;
  cart.total = Math.max(0, cart.subtotal - cart.discount);

  // Overwriting lastAppliedCoupon clears the restriction on the other code!
  cart.lastAppliedCoupon = code; 

  return res.json({ cart });
});`}
          </CodeBlock>
        </Card>
      )}

      {/* Deep-dive core concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-2">
          <Badge color="cyan">State Tracking</Badge>
          <h5 className="font-bold text-white text-sm">Session Set vs Last Value</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Storing only the most recent coupon allows previous coupons to be recycled. A robust system requires a persistent Set of all redeemed codes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-2">
          <Badge color="amber">Discount Stacking</Badge>
          <h5 className="font-bold text-white text-sm">Uncapped Stacking</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            The application allowed stacking discounts without enforcing a global percentage ceiling (e.g. maximum 30% total savings per checkout).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-2">
          <Badge color="emerald">Authoritative Pricing</Badge>
          <h5 className="font-bold text-white text-sm">Recalculation From Base</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            The total should always recompute as: <code className="text-cyan-300">Base Price × (1 - Best Coupon %)</code>, rather than recursively compounding deductions.
          </p>
        </div>
      </div>

      <RevealBlock label="Show explanation">
        <div className="space-y-4">
          <Callout tone="warn" title="Why Business Logic Flaws Go Undetected">
            <p>
              Traditional vulnerability scanners search for injection strings (SQLi, XSS) or outdated dependencies.
              They cannot comprehend whether alternating two legitimate discount codes violates the merchant's business model.
            </p>
            <p className="mt-2 text-slate-300">
              Only careful manual security testing and understanding feature workflows reveal these state validation gaps.
            </p>
          </Callout>

          <SectionLabel icon="🔑">Security takeaway</SectionLabel>
          <p className="text-sm text-slate-400 leading-relaxed">
            Always implement <strong className="text-slate-200">authoritative pricing recalculation from scratch</strong> upon any cart modification.
            Never rely on incremental state mutations where previous restrictions can be wiped by subsequent valid inputs.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}
