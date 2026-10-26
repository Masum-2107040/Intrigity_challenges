import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, HttpBlock } from '../components/ui';

export default function Step3() {
  const [tried, setTried] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        Next, we test whether the quantity parameter can be manipulated. Submitting a negative
        quantity or zero might cause unexpected behavior in the pricing logic — for example,
        subtracting from the total instead of adding.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        <strong>Input validation flaws</strong> in quantity handling have caused real vulnerabilities
        in production systems. If a server multiplies price × quantity without checking for negative
        numbers, the result could be a negative line total that reduces the cart's overall cost.
      </Callout>

      <SectionLabel icon="🧪">Try it yourself</SectionLabel>
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400 w-24">Product ID</label>
            <input
              value="midnight-vault"
              readOnly
              className="flex-1 bg-charcoal-800 border border-navy-600 rounded px-3 py-2 text-sm font-mono text-slate-300"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400 w-24">Quantity</label>
            <input
              value="-1"
              readOnly
              className="flex-1 bg-charcoal-800 border border-navy-600 rounded px-3 py-2 text-sm font-mono text-red-400"
            />
            <span className="text-xs text-red-400">← Tampered</span>
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
            {tried ? 'Request sent' : 'Send modified request'}
          </button>
        </div>
      </Card>

      {tried && (
        <div className="space-y-4 animate-fade-in-up">
          <HttpBlock
            method="POST"
            url="/api/cart/items"
            body={`{"productId": "midnight-vault", "quantity": -1}`}
            status={200}
            response={`{
  "ok": true,
  "cart": {
    "items": [{
      "id": "midnight-vault",
      "price": 66600,
      "quantity": 1,  ← Server ignores negative quantity
      "lineTotal": 66600
    }],
    "total": 66600
  }
}`}
          />

          <Callout tone="error" title="Result: Quantity override ignored">
            The server ignored the negative quantity and added the item with <strong>quantity: 1</strong>.
            The pricing logic is not affected by this manipulation.
          </Callout>
        </div>
      )}

      <RevealBlock label="Show technical explanation">
        <div className="space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            The server either ignores the quantity parameter entirely or validates it server-side.
            In this store, each item can only be added once (subsequent adds return <code className="bg-navy-700 px-1 py-0.5 rounded text-xs text-cyan-400">"already_in_cart"</code>),
            and the quantity is always forced to 1.
          </p>

          <SectionLabel icon="🔑">Security takeaway</SectionLabel>
          <Callout tone="success">
            <strong>Server-side input validation</strong> prevents quantity manipulation from affecting the total.
            However, just because direct parameter tampering fails doesn't mean the application is fully secure.
            Business logic vulnerabilities often exist in <em>how features interact</em>, not in individual inputs.
            We need to look deeper — at the <strong>coupon and discount system</strong>.
          </Callout>
        </div>
      </RevealBlock>
    </div>
  );
}
