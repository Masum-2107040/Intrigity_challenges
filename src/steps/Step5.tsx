import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, HttpBlock } from '../components/ui';

export default function Step5() {
  const [tried, setTried] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        Now we test whether the same coupon code can be applied <strong className="text-white">a second time</strong>.
        If the server doesn't track which coupons have already been used, we could stack the same discount repeatedly.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        <strong>Coupon reuse</strong> is one of the most common e-commerce logic bugs. A server must
        track applied coupons and reject duplicates. But how it tracks them — and what counts as a
        "duplicate" — determines whether the protection actually works.
      </Callout>

      <SectionLabel icon="🧪">Try it yourself</SectionLabel>
      <p className="text-sm text-slate-400 mb-3">
        NIGHT20 is already applied. Click below to try applying it again.
      </p>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-navy-800 border border-navy-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-mono text-emerald-400">NIGHT20</span>
            <span className="text-xs text-slate-500 ml-auto">Already applied</span>
          </div>
          <button
            onClick={() => setTried(true)}
            disabled={tried}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
              tried
                ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {tried ? 'Request sent' : 'Apply NIGHT20 again'}
          </button>
        </div>
      </Card>

      {tried && (
        <div className="space-y-4 animate-fade-in-up">
          <HttpBlock
            method="POST"
            url="/api/cart/coupon"
            body={`{"code": "NIGHT20"}`}
            status={409}
            response={`{
  "ok": false,
  "error": "coupon_already_applied",
  "message": "Coupon already applied."
}`}
          />

          <Callout tone="error" title="Result: Duplicate rejected">
            The server correctly rejected the duplicate coupon with a <strong>409 Conflict</strong> status
            and the message "Coupon already applied."
          </Callout>
        </div>
      )}

      <RevealBlock label="Show technical explanation">
        <div className="space-y-4">
          <Callout tone="warn" title="What this tells us — and what it doesn't">
            <p>
              The server prevents the <em>exact same code</em> from being applied twice. This is good basic validation.
            </p>
            <p className="mt-2">
              But this doesn't answer a critical question: <strong className="text-white">What happens if we use a different coupon code?</strong>
            </p>
          </Callout>

          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">▸</span>
              <p>The server checks: "Is this <em>exact code</em> already in the list?"</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">▸</span>
              <p>But does it check: "Has the <em>maximum discount</em> been reached?"</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">▸</span>
              <p>And: "Can different coupon codes be <em>stacked</em> without limit?"</p>
            </div>
          </div>

          <SectionLabel icon="🔑">Security takeaway</SectionLabel>
          <p className="text-sm text-slate-400 leading-relaxed">
            Preventing duplicate coupon codes is necessary but <strong className="text-slate-200">not sufficient</strong>.
            The server must also enforce rules about <strong className="text-slate-200">total discount caps</strong> and
            <strong className="text-slate-200"> coupon stacking</strong>. Finding another valid coupon code would let us
            test these boundaries.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}
