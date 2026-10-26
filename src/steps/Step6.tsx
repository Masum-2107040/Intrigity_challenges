import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, HttpBlock } from '../components/ui';
import SimulatedCart from '../components/SimulatedCart';

export default function Step6() {
  const [subscribed, setSubscribed] = useState(false);
  const [applied, setApplied] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        During reconnaissance, we noticed a <strong className="text-white">newsletter signup form</strong> in the
        store's footer. Many e-commerce sites offer first-time subscriber discounts. Let's explore this feature
        to see if it reveals another coupon code.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        Security testing isn't just about attacking the obvious features. <strong>Expanding scope</strong> to
        secondary features — like newsletter signups, referral systems, or account settings — often reveals
        additional inputs and behaviors that interact with the primary shopping flow.
      </Callout>

      <SectionLabel icon="🧪">Try it yourself</SectionLabel>
      <p className="text-sm text-slate-400 mb-3">
        Subscribe to the newsletter to discover a new coupon code.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <h4 className="font-semibold text-white mb-1">🎃 October Newsletter</h4>
            <p className="text-xs text-slate-500 mb-4">Seasonal drops, opening hours and occasional surprises.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                disabled={subscribed}
                className="flex-1 bg-charcoal-800 border border-navy-600 rounded px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setSubscribed(true)}
                disabled={subscribed || !email.includes('@')}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  subscribed
                    ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                    : !email.includes('@')
                    ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {subscribed ? '✓ Subscribed' : 'Subscribe'}
              </button>
            </div>

            {subscribed && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-700/40 animate-fade-in-up">
                <p className="text-sm text-emerald-300">
                  Subscription confirmed. Your welcome code: <strong className="font-mono text-white">NEWS30</strong>
                </p>
              </div>
            )}
          </Card>

          {subscribed && (
            <Card className="animate-fade-in-up">
              <h4 className="font-semibold text-white mb-3">Apply Newsletter Code</h4>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-navy-800 border border-navy-700 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-mono text-emerald-400">NIGHT20</span>
                <span className="text-xs text-slate-500 ml-auto">Previously applied</span>
              </div>
              <button
                onClick={() => setApplied(true)}
                disabled={applied}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  applied
                    ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {applied ? '✓ NEWS30 Applied' : 'Apply NEWS30'}
              </button>
            </Card>
          )}
        </div>

        <SimulatedCart
          coupons={
            applied
              ? [
                  { code: 'NIGHT20', percent: 20, appliedAt: 4 },
                  { code: 'NEWS30', percent: 30, appliedAt: 6 },
                ]
              : [{ code: 'NIGHT20', percent: 20, appliedAt: 4 }]
          }
          showCheckout
        />
      </div>

      {subscribed && (
        <div className="space-y-4 animate-fade-in-up">
          <HttpBlock
            method="POST"
            url="/api/newsletter"
            body={`{"email": "${email || 'user@example.com'}"}`}
            status={200}
            response={`{
  "ok": true,
  "code": "NEWS30",
  "message": "Your first-order code is ready."
}`}
          />
        </div>
      )}

      {applied && (
        <RevealBlock label="Show explanation">
          <div className="space-y-4">
            <Callout tone="warn" title="Two coupons stacked — but still not enough">
              <p>
                With both NIGHT20 (20%) and NEWS30 (30%) applied, the discount is now <strong>50%</strong>,
                bringing the price from €666.00 down to <strong>€333.00</strong>.
              </p>
              <p className="mt-2">
                That's still far above our €66.00 credit. But something critical just happened: the server
                <strong className="text-white"> allowed two different coupons to stack</strong>.
              </p>
            </Callout>

            <SectionLabel icon="🔑">Security takeaway</SectionLabel>
            <p className="text-sm text-slate-400 leading-relaxed">
              The ability to stack multiple coupons is a <strong className="text-slate-200">business logic concern</strong>.
              The server prevents the same code from being applied twice — but it allows
              <em> different</em> codes to be applied together without a cap on total discount. This is the
              foundation of the vulnerability we're about to exploit.
            </p>
          </div>
        </RevealBlock>
      )}
    </div>
  );
}
